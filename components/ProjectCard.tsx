import React from 'react';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onSelectProject: () => void;
  fallbackImageUrl?: string;
}

const isVideoUrl = (url: string) => {
  const normalized = url.split('?')[0].split('#')[0].toLowerCase();
  return normalized.endsWith('.mp4') || normalized.endsWith('.webm') || normalized.endsWith('.ogg');
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelectProject, fallbackImageUrl }) => {
  const showImage = Boolean(project.thumbnail) && !project.hideImages;
  const showVideoThumbnail = showImage && isVideoUrl(project.thumbnail);
  const firstBenchmark = project.benchmarks?.[0];
  const hasBenchmarks = Boolean(project.benchmarks && project.benchmarks.length > 0);

  return (
    <div 
      className="group relative cursor-pointer overflow-hidden rounded-lg bg-slate-800/50 transition-all duration-300 hover:bg-slate-800/80 hover:shadow-2xl hover:shadow-teal-500/10"
      onClick={onSelectProject}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelectProject();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open project: ${project.title}`}
    >
      {showImage ? (
        <>
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 to-transparent"></div>
          {hasBenchmarks && (
            <div className="absolute left-3 top-3 z-20 rounded-full border border-emerald-300/30 bg-emerald-400/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-100">
              Data-backed
            </div>
          )}
          {showVideoThumbnail ? (
            <video
              src={project.thumbnail}
              className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster={fallbackImageUrl}
              onError={(event) => {
                if (fallbackImageUrl && event.currentTarget.poster !== fallbackImageUrl) {
                  event.currentTarget.poster = fallbackImageUrl;
                }
              }}
            />
          ) : (
            <img 
              src={project.thumbnail} 
              alt={`${project.title} thumbnail`} 
              className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
              onError={(event) => {
                if (fallbackImageUrl && event.currentTarget.src !== fallbackImageUrl) {
                  event.currentTarget.src = fallbackImageUrl;
                }
              }}
            />
          )}
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
            <h3 className="text-lg font-bold text-slate-100">{project.title}</h3>
            <p className="mt-1 text-sm text-slate-400">{project.description}</p>
            {firstBenchmark && (
              <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-slate-300/90">
                {firstBenchmark.label}: {firstBenchmark.value}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {project.techStack.slice(0, 3).map((tech) => (
                <span key={tech} className="rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium text-teal-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-60 flex-col justify-end p-6">
          {hasBenchmarks && (
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-emerald-200">Data-backed project</p>
          )}
          <h3 className="text-lg font-bold text-slate-100">{project.title}</h3>
          <p className="mt-1 text-sm text-slate-400">{project.description}</p>
          {firstBenchmark && (
            <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
              {firstBenchmark.label}: {firstBenchmark.value}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {project.techStack.slice(0, 3).map((tech) => (
              <span key={tech} className="rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium text-teal-300">
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
