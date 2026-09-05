import React, { useRef } from 'react';
import { SOCIAL_LINKS } from '../constants';
import { GitHubIcon } from './Icons';
import { resolveAssetUrl } from '../utils/assets';

// Kept under the existing component name so the discreet home gesture and
// imports remain stable while the portfolio uses a single horizontal header.
export const Sidebar: React.FC = () => {
  const easterEggRef = useRef({ count: 0, lastAt: 0 });

  const handleHomeClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const now = Date.now();
    const state = easterEggRef.current;
    state.count = now - state.lastAt < 1800 ? state.count + 1 : 1;
    state.lastAt = now;
    if (state.count >= 4) {
      event.preventDefault();
      state.count = 0;
      state.lastAt = 0;
      window.location.assign(resolveAssetUrl('skill-wind/'));
    }
  };

  return (
    <header className="site-header">
      <a href="#intro" className="site-brand" aria-label="Zakhar Pashkin" onClick={handleHomeClick}>
        <span className="site-brand__monogram" aria-hidden="true">zp<span>.</span></span>
        <span className="site-brand__name">Zakhar Pashkin</span>
      </a>
      <nav className="site-nav" aria-label="Primary portfolio navigation">
        <a href="#featured">Work</a>
        <a href="#experience">Experience</a>
        <a href="#projects" className="site-nav__desktop">Projects</a>
        <a href="/papers/" className="site-nav__desktop">Notes</a>
        <a href="#contact" className="site-nav__contact">Contact <span aria-hidden="true">↗</span></a>
      </nav>
      <a href={SOCIAL_LINKS.githubPrimary} target="_blank" rel="noopener noreferrer" className="header-github" aria-label="GitHub">
        <GitHubIcon className="h-5 w-5" />
      </a>
    </header>
  );
};
