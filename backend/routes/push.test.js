import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";
import { UniqueConstraintError } from "sequelize";

// Mock auth like scores.test.js: currentUser settable per-test, rateLimit a
// passthrough (the limiter itself is covered by auth.test.js).
vi.mock("../lib/auth.js", async () => {
  const actual = await vi.importActual("../lib/auth.js");
  return {
    ...actual,
    currentUser: vi.fn(async () => null),
    rateLimit: () => (req, _res, next) => next(),
  };
});

// Keep the REAL isAllowedPushEndpoint so the SSRF allowlist is exercised;
// mock only configuration + broadcast.
vi.mock("../lib/push.js", async () => {
  const actual = await vi.importActual("../lib/push.js");
  return {
    ...actual,
    isConfigured: vi.fn(() => true),
    getPublicKey: vi.fn(() => "PUBKEY"),
    sendBroadcast: vi.fn(),
  };
});

vi.mock("../models.js", () => ({
  PushSubscription: {
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue([1]),
    destroy: vi.fn().mockResolvedValue(0),
  },
}));

import { currentUser } from "../lib/auth.js";
import { isConfigured } from "../lib/push.js";
import { PushSubscription } from "../models.js";
import pushRoutes from "./push.js";

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/push", pushRoutes);
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => res.status(err?.status || 500).json({ error: "internal" }));
  return app;
}

const SUB = {
  endpoint: "https://fcm.googleapis.com/fcm/send/abc123",
  keys: { p256dh: "p256dh-key", auth: "auth-key" },
};

beforeEach(() => {
  vi.clearAllMocks();
  isConfigured.mockReturnValue(true);
  currentUser.mockResolvedValue(null);
  PushSubscription.create.mockResolvedValue({});
  PushSubscription.update.mockResolvedValue([1]);
  PushSubscription.destroy.mockResolvedValue(0);
});

describe("unconfigured gate", () => {
  it("503s every push route when VAPID keys are missing", async () => {
    isConfigured.mockReturnValue(false);
    const res = await request(makeApp()).get("/api/push/public-key");
    expect(res.status).toBe(503);
    expect(res.body.error).toBe("push-not-configured");
  });
});

describe("GET /api/push/public-key", () => {
  it("returns the VAPID public key", async () => {
    const res = await request(makeApp()).get("/api/push/public-key");
    expect(res.status).toBe(200);
    expect(res.body.key).toBe("PUBKEY");
  });
});

describe("POST /api/push/subscribe", () => {
  it("201 creates an anonymous subscription", async () => {
    const res = await request(makeApp()).post("/api/push/subscribe").send(SUB);
    expect(res.status).toBe(201);
    expect(PushSubscription.create).toHaveBeenCalledWith({
      endpoint: SUB.endpoint,
      p256dh: "p256dh-key",
      auth: "auth-key",
      UserId: null,
    });
  });

  it("attaches the signed-in caller's id", async () => {
    currentUser.mockResolvedValue({ id: "u1" });
    await request(makeApp()).post("/api/push/subscribe").send(SUB);
    expect(PushSubscription.create).toHaveBeenCalledWith(
      expect.objectContaining({ UserId: "u1" })
    );
  });

  it("200 upserts when the endpoint already exists", async () => {
    PushSubscription.create.mockRejectedValue(new UniqueConstraintError({}));
    const res = await request(makeApp()).post("/api/push/subscribe").send(SUB);
    expect(res.status).toBe(200);
    expect(PushSubscription.update).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: SUB.endpoint }),
      { where: { endpoint: SUB.endpoint } }
    );
  });

  it("400 rejects a non-https endpoint", async () => {
    const res = await request(makeApp())
      .post("/api/push/subscribe")
      .send({ ...SUB, endpoint: "http://fcm.googleapis.com/fcm/send/abc" });
    expect(res.status).toBe(400);
    expect(PushSubscription.create).not.toHaveBeenCalled();
  });

  it("400 rejects an endpoint off the push-service allowlist (SSRF guard)", async () => {
    for (const endpoint of [
      "https://push.example.com/sub/abc123",
      "https://169.254.169.254/latest/meta-data",
      "https://evilfcm.googleapis.com.attacker.io/send",
    ]) {
      const res = await request(makeApp())
        .post("/api/push/subscribe")
        .send({ ...SUB, endpoint });
      expect(res.status).toBe(400);
    }
    expect(PushSubscription.create).not.toHaveBeenCalled();
  });

  it("guest upsert refreshes keys but never reassigns ownership", async () => {
    PushSubscription.create.mockRejectedValue(new UniqueConstraintError({}));
    await request(makeApp()).post("/api/push/subscribe").send(SUB);
    const [values] = PushSubscription.update.mock.calls[0];
    expect(values).not.toHaveProperty("UserId");
  });

  it("400 rejects missing keys", async () => {
    const res = await request(makeApp())
      .post("/api/push/subscribe")
      .send({ endpoint: SUB.endpoint });
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/push/subscribe", () => {
  it("204 removes the row by endpoint", async () => {
    const res = await request(makeApp())
      .delete("/api/push/subscribe")
      .send({ endpoint: SUB.endpoint });
    expect(res.status).toBe(204);
    expect(PushSubscription.destroy).toHaveBeenCalledWith({
      where: { endpoint: SUB.endpoint },
    });
  });

  it("400 without an endpoint", async () => {
    const res = await request(makeApp()).delete("/api/push/subscribe").send({});
    expect(res.status).toBe(400);
  });
});
