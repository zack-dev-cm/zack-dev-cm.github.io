import React from 'react';
import { AUTHOR_INFO, SOCIAL_LINKS } from '../constants';
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from './Icons';

const NAV_ITEMS = [
  { name: 'Intro', href: '#intro' },
  { name: 'About', href: '#about' },
  { name: 'Collaborations', href: '#experience' },
  { name: 'Featured', href: '#featured' },
  { name: 'ClawHub', href: '#clawhub' },
  { name: 'Latest', href: '#latest' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' }
];

interface SidebarProps {
  projectCount: number;
  userFacingCount: number;
  benchmarkedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ projectCount, userFacingCount, benchmarkedCount }) => {
  return (
    <header className="profile-panel">
      <div className="profile-panel__content">
        <div className="profile-panel__intro">
          <a href="#intro" className="profile-panel__home">
            {AUTHOR_INFO.name}
          </a>
          <p className="profile-panel__role">{AUTHOR_INFO.title}</p>
          <p className="profile-panel__bio">{AUTHOR_INFO.bio}</p>
        </div>

        <div className="profile-panel__stats" aria-label="Sidebar quick stats">
          <div className="profile-stat">
            <strong>{projectCount}</strong>
            <span>case studies</span>
          </div>
          <div className="profile-stat">
            <strong>{userFacingCount}</strong>
            <span>user products</span>
          </div>
          <div className="profile-stat">
            <strong>{benchmarkedCount}</strong>
            <span>with metrics</span>
          </div>
        </div>

        <nav className="profile-nav" aria-label="Section navigation">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.name}>
                <a href={item.href}>{item.name}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="profile-panel__actions">
          <a href={`mailto:${SOCIAL_LINKS.email}`} className="button button--primary button--block">
            Email me
          </a>
          <a
            href={SOCIAL_LINKS.resume}
            download="zakhar-pashkin-ai-product-engineer-resume.pdf"
            className="button button--ghost button--block"
          >
            <DownloadIcon className="h-4 w-4" />
            Resume PDF
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="button button--ghost button--block"
          >
            LinkedIn
          </a>
        </div>

        <div className="profile-panel__socials">
          <a
            href={SOCIAL_LINKS.githubPrimary}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="profile-social"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="profile-social"
          >
            <LinkedInIcon className="h-5 w-5" />
          </a>
          <a href={`mailto:${SOCIAL_LINKS.email}`} aria-label="Email" className="profile-social">
            <MailIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </header>
  );
};
