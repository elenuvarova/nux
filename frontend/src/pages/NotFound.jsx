import { Link } from 'react-router-dom';
import usePageTitle from '../lib/usePageTitle.js';
import './Browse.css';

export default function NotFound({ message = 'This page doesn’t exist.' }) {
  usePageTitle('Not found');
  return (
    <main className="browse">
      <div className="browse-empty notfound">
        <h1 className="display-m" tabIndex={-1}>
          Nothing here
        </h1>
        <p className="browse-empty-sub">{message}</p>
        <Link to="/" className="btn btn-primary">
          Back to home
        </Link>
      </div>
    </main>
  );
}
