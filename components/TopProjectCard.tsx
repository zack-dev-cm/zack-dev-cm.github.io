import React from 'react';
import type { Project } from '../types';
import { ExternalLinkIcon } from './Icons';

interface TopProjectCardProps {
  project: Project;
  onSelectProject: () => void;
}

export const TopProjectCard: React.FC<TopProjectCardProps> = ({ project, onSelectProject }) => {
  const benchmarks = project.benchmarks ?? [];
  const hasBenchmarks = benchmarks.length > 0;

  return (
    <div
      className="rounded-lg border border-slate-800 bg-slate-900/40 p-6 transition hover:bg-slate-900/60 hover:shadow-2xl hover:shadow-teal-500/10"
      aria-label={`Top project: ${project.title}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-slate-100 truncate">{project.title}</h3>
          <p className="mt-1 text-sm text-slate-400">{project.description}</p>
        </div>
        <button
          type="button"
          onClick={onSelectProject}
          className="shrink-0 rounded-full bg-teal-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal-300 transition hover:bg-teal-400/20"
        >
          View
        </button>
      </div>

      {hasBenchmarks ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {benchmarks.slice(0, 4).map((metric) => (
            <div
              key={`${project.id}:${metric.label}`}
              className="rounded-lg border border-slate-800 bg-slate-950/40 p-3"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{metric.label}</p>
              <p className="mt-1 text-lg font-semibold text-slate-200">{metric.value}</p>
              {metric.context ? <p className="mt-1 text-xs text-slate-500">{metric.context}</p> : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-sm text-slate-500">Metrics coming soon.</p>
      )}

      {project.links.length > 0 ? (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {project.links.slice(0, 4).map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-400 transition hover:border-teal-400/70 hover:text-teal-200"
            >
              <ExternalLinkIcon className="h-4 w-4" />
              {link.text}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
};

