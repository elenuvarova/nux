import './Skeleton.css';

/* Warm blur-up skeletons for first paint. `kind` picks the shape;
   the shimmer is one shared keyframe so the whole page pulses together. */
export function SkeletonRail({ wide = false }) {
  return (
    <div className="sk-rail">
      <div className="sk-line sk-line--head" />
      <div className={`sk-row ${wide ? 'sk-row--wide' : ''}`}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div className="sk-card" key={i}>
            <div className={`sk-box ${wide ? 'sk-box--wide' : 'sk-box--poster'}`} />
            <div className="sk-line sk-line--title" />
            <div className="sk-line sk-line--meta" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 12 }) {
  return (
    <div className="sk-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div className="sk-card" key={i}>
          <div className="sk-box sk-box--poster" />
          <div className="sk-line sk-line--title" />
        </div>
      ))}
    </div>
  );
}
