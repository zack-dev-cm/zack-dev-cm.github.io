import React from 'react';
import { AUTHOR_INFO, SOCIAL_LINKS } from '../constants';
import { GitHubIcon, LinkedInIcon, MailIcon } from './Icons';

const NAV_ITEMS = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Stack', href: '#stack'},
  { name: 'Top', href: '#top' },
  { name: 'Latest', href: '#latest' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

export const Sidebar: React.FC = () => {
  return (
    <header className="lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-80 xl:w-96 lg:flex-col lg:border-r lg:border-slate-800 bg-slate-900/70 backdrop-blur-sm">
      <div className="flex h-full w-full flex-col p-6 sm:p-10 md:p-12 lg:p-16">
        <div className="flex-1">
          <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl">
            {AUTHOR_INFO.name}
          </h1>
          <h2 className="mt-3 text-lg font-medium tracking-tight text-slate-200 sm:text-xl">
            {AUTHOR_INFO.title}
          </h2>
          <p className="mt-4 max-w-xs leading-normal text-slate-400">
            {AUTHOR_INFO.bio}
          </p>

          <nav className="hidden lg:block mt-12 w-max">
            <ul className="flex flex-col space-y-4">
              {NAV_ITEMS.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="group flex items-center py-1 transition-all">
                    <span className="mr-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-200"></span>
                    <span className="text-sm font-semibold uppercase tracking-widest text-slate-500 group-hover:text-slate-200">
                      {item.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center space-x-6 mt-8">
          <a href={SOCIAL_LINKS.githubPrimary} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-slate-400 hover:text-slate-200 transition-colors">
            <GitHubIcon className="h-6 w-6" />
          </a>
          <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-slate-400 hover:text-slate-200 transition-colors">
            <LinkedInIcon className="h-6 w-6" />
          </a>
          <a href={`mailto:${SOCIAL_LINKS.email}`} aria-label="Email" className="text-slate-400 hover:text-slate-200 transition-colors">
            <MailIcon className="h-6 w-6" />
          </a>
        </div>
      </div>
    </header>
  );
};
