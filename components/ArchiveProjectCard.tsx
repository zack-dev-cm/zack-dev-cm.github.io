import React from 'react';
import type { Project } from '../types';

interface ArchiveProjectCardProps {
  project: Project;
  href: string;
  badges?: string[];
  onSelectProject: () => void;
  fallbackImageUrl?: string;
}

export const ArchiveProjectCard: React.FC<ArchiveProjectCardProps> = ({ project, href, onSelectProject, fallbackImageUrl }) => {
  const asset = project.images.find((image) => image.url === project.thumbnail) || project.images[0];
  const showImage = Boolean(project.thumbnail) && project.thumbnail !== fallbackImageUrl && !project.hideImages && !/\.(mp4|webm|ogg)(?:[?#]|$)/i.test(project.thumbnail);
  const isIllustration = Boolean(asset && /generated|conceptual|illustration|public-safe.*card/i.test(asset.alt));
  return (
    <a href={href} className="project-card" onClick={(event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      onSelectProject();
    }} aria-label={`Open project: ${project.title}`} data-project-id={project.id} data-testid="project-card">
      {showImage && (
        <div className="project-card__media">
          <img src={project.thumbnail} alt={asset?.alt || `${project.title} preview`} className="project-card__asset" loading="lazy" decoding="async" onError={(event) => {
            if (fallbackImageUrl && event.currentTarget.src !== fallbackImageUrl) event.currentTarget.src = fallbackImageUrl;
          }} />
          {isIllustration && <span className="project-card__caption">System illustration</span>}
        </div>
      )}
      <div className="project-card__body">
        <p className="project-card__category">{project.projectKind === 'open-source' ? 'Open source' : project.projectKind === 'research' ? 'Research & development' : project.projectKind === 'user-product' ? 'Product' : 'Engineering project'}</p>
        <h3>{project.title}</h3>
        <p className="project-card__description">{project.description}</p>
        <span className="project-card__stack">{project.techStack.slice(0, 3).join(' · ')}</span>
        <span className="project-card__open" aria-hidden="true">Explore project <span>↗</span></span>
      </div>
    </a>
  );
};
