'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'Profile' },
  { href: '/contact', label: 'Contact' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 400,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px var(--gutter)',
        mixBlendMode: 'difference',
      }}
    >
      <Link
        href="/"
        className="caption link-line"
        style={{ color: 'var(--bone)', fontWeight: 700 }}
      >
        Sanya Munam
      </Link>

      <div style={{ display: 'flex', gap: 'clamp(16px, 3vw, 36px)', alignItems: 'baseline' }}>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="caption link-line"
            style={{
              color: pathname.startsWith(l.href) ? 'var(--turquoise)' : 'var(--bone)',
            }}
          >
            {l.label}
          </Link>
        ))}
        <span className="caption nav-meta" style={{ color: 'var(--muted)' }}>
          Doha ©2026
        </span>
      </div>
    </nav>
  );
}
