import { useRouter } from 'next/router';
import Link from 'next/link';

type BottomNavProps = {
  activePage: 'home' | 'content' | 'scapes' | 'profile';
};

export default function BottomNav({ activePage }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      <Link href="/home">
        <a className={`nav-item ${activePage === 'home' ? 'active' : ''}`}>
          <svg className="nav-icon" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="nav-label">Home</span>
        </a>
      </Link>
      
      <Link href="/content">
        <a className={`nav-item ${activePage === 'content' ? 'active' : ''}`}>
          <svg className="nav-icon" viewBox="0 0 24 24">
            <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9l-7-7z" />
            <polyline points="13 2 13 9 20 9" />
          </svg>
          <span className="nav-label">Content</span>
        </a>
      </Link>
      
      <Link href="/scapes">
        <a className={`nav-item ${activePage === 'scapes' ? 'active' : ''}`}>
          <svg className="nav-icon" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span className="nav-label">Scapes</span>
        </a>
      </Link>
      
      <Link href="/profile">
        <a className={`nav-item ${activePage === 'profile' ? 'active' : ''}`}>
          <svg className="nav-icon" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="nav-label">Profile</span>
        </a>
      </Link>
    </nav>
  );
}
