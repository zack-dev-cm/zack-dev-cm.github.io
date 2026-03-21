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
    <button
      type="button"
      className="project-card"
      onClick={onSelectProject}
      aria-label={`Open project: ${project.title}`}
    >
      <div className="project-card__media">
        {showImage ? (
          showVideoThumbnail ? (
            <video
              src={project.thumbnail}
              className="project-card__asset"
              muted
              loop
              autoPlay
              playsInline
              preload="metadata"
              poster={fallbackImageUrl}
            />
          ) : (
            <img
              src={project.thumbnail}
              alt={`${project.title} thumbnail`}
              className="project-card__asset"
              loading="lazy"
              decoding="async"
              onError={(event) => {
                if (fallbackImageUrl && event.currentTarget.src !== fallbackImageUrl) {
                  event.currentTarget.src = fallbackImageUrl;
                }
              }}
            />
          )
        ) : (
          <div className="project-card__fallback">
            <span>{hasBenchmarks ? 'Data-backed case study' : 'Project archive'}</span>
            <strong>{project.techStack.slice(0, 3).join(' · ')}</strong>
          </div>
        )}
      </div>

      <div className="project-card__body">
        <div className="project-card__meta">
          <span className="pill">{hasBenchmarks ? 'Proof included' : 'Case study'}</span>
          <span className="project-card__id">#{project.id}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>

        {firstBenchmark && (
          <div className="project-card__benchmark">
            <strong>{firstBenchmark.label}</strong>
            <span>{firstBenchmark.value}</span>
          </div>
        )}

        <div className="chip-row">
          {project.techStack.slice(0, 4).map((tech) => (
            <span key={tech} className="pill">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
};
