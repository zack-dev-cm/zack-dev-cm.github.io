import React, { useEffect, useRef, useState } from 'react';
import type { Project } from '../types';
import { ExternalLinkIcon, XIcon, ChevronLeftIcon, ChevronRightIcon, LinkIcon } from './Icons';
import { MermaidDiagram } from './MermaidDiagram';

interface ProjectModalProps {
  project: Project;
  badges?: string[];
  onClose: () => void;
  onCopyShare?: () => void;
  isShareCopied?: boolean;
  fallbackImageUrl?: string;
}

const isVideoUrl = (url: string) => {
  const normalized = url.split('?')[0].split('#')[0].toLowerCase();
  return normalized.endsWith('.mp4') || normalized.endsWith('.webm') || normalized.endsWith('.ogg');
};

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  badges = [],
  onClose,
  onCopyShare,
  isShareCopied,
  fallbackImageUrl
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const titleId = `project-modal-title-${project.id}`;
  const descriptionId = `project-modal-description-${project.id}`;

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [project]);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const background = document.querySelector<HTMLElement>('.site-layout');
    const wasInert = background?.inert ?? false;
    if (background) background.inert = true;

    const getFocusableElements = () =>
      Array.from<HTMLElement>(modalRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, video[controls], audio[controls], [tabindex]:not([tabindex="-1"])'
      ) ?? []).filter((element) => element.getClientRects().length > 0);

    getFocusableElements()[0]?.focus({ preventScroll: true });

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === 'Tab') {
        const focusableElements = getFocusableElements();
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
      if (background) background.inert = wasInert;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % project.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + project.images.length) % project.images.length);
  };

  const currentImage = project.images[currentImageIndex];
  const mediaCaption = currentImage?.caption || (
    /generated|conceptual|illustration|public-safe.*card/i.test(currentImage?.alt ?? '')
      ? 'Conceptual workflow illustration.'
      : undefined
  );

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div ref={modalRef} className="modal-card">
        <button onClick={onClose} className="modal-close" aria-label="Close project details">
          <XIcon className="h-6 w-6" />
        </button>

        {currentImage && (
          <div className="modal-visual">
          <div className="modal-media">
            {isVideoUrl(currentImage.url) ? (
              <video
                src={currentImage.url}
                className="modal-media__asset"
                key={currentImage.url}
                controls
                playsInline
                preload="metadata"
                poster={fallbackImageUrl}
              />
            ) : (
              <img
                src={currentImage.url}
                alt={currentImage.alt}
                className="modal-media__asset"
                loading="lazy"
                decoding="async"
                key={currentImage.url}
                onError={(event) => {
                  if (fallbackImageUrl && event.currentTarget.src !== fallbackImageUrl) {
                    event.currentTarget.src = fallbackImageUrl;
                  }
                }}
              />
            )}

            {project.images.length > 1 && (
              <>
                <button type="button" onClick={handlePrevImage} className="modal-media__nav modal-media__nav--prev" aria-label="Previous image">
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button type="button" onClick={handleNextImage} className="modal-media__nav modal-media__nav--next" aria-label="Next image">
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
                <div className="modal-media__dots">
                  {project.images.map((image, index) => (
                    <button
                      key={image.url}
                      type="button"
                      onClick={() => setCurrentImageIndex(index)}
                      className={`modal-media__dot${index === currentImageIndex ? ' is-active' : ''}`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="modal-media-caption">
            {mediaCaption && <p>{mediaCaption}</p>}
            {currentImage && !isVideoUrl(currentImage.url) && (
              <a href={currentImage.url} target="_blank" rel="noopener noreferrer" className="text-link">Open full-size image <span aria-hidden="true">↗</span></a>
            )}
          </div>
          </div>
        )}

        <div className="modal-body">
          <div className="modal-body__header">
            <div>
              <p className="modal-body__eyebrow">Case study</p>
              <h2 id={titleId}>{project.title}</h2>
            </div>

            {onCopyShare && (
              <button
                type="button"
                onClick={onCopyShare}
                className="button button--ghost button--small"
                aria-label="Copy project link"
              >
                <LinkIcon className="h-4 w-4" />
                <span>{isShareCopied ? 'Copied' : 'Copy link'}</span>
              </button>
            )}
          </div>

          <p id={descriptionId} className="modal-body__lead">
            {project.longDescription || project.description}
          </p>

          {project.caseStudySections?.map((section) => (
            <section key={section.title} className="case-study-section">
              <h3>{section.title}</h3>
              <p>{section.body}</p>
            </section>
          ))}

          {badges.length > 0 && (
            <div className="chip-row modal-body__badges" aria-label="Project badges">
              {badges.map((badge) => (
                <span key={badge} className="pill">
                  {badge}
                </span>
              ))}
            </div>
          )}

          <div className="modal-body__grid">
            <section className="panel">
              <p className="panel__eyebrow">Highlights</p>
              <h3>Key features</h3>
              <ul className="bullet-list bullet-list--compact">
                {project.keyFeatures.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </section>

            <section className="panel">
              <p className="panel__eyebrow">Stack</p>
              <h3>Tech stack</h3>
              <div className="chip-row">
                {project.techStack.map((tech) => (
                  <span key={tech} className="pill">
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {project.benchmarks && project.benchmarks.length > 0 && (
            <section className="panel">
              <p className="panel__eyebrow">Metrics</p>
              <h3>Benchmarks and analytics</h3>
              <div className="metric-grid">
                {project.benchmarks.map((benchmark, index) => (
                  <div key={`${benchmark.label}-${index}`} className="metric-chip">
                    <strong>{benchmark.label}</strong>
                    <span>{benchmark.value}</span>
                    {benchmark.context && <em>{benchmark.context}</em>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {project.topologySnapshot && (
            <section className="panel">
              <h3>System overview</h3>
              <pre className="code-block">{project.topologySnapshot}</pre>
            </section>
          )}

          {project.mermaidDiagram && (
            <section className="panel">
              <h3>Workflow</h3>
              <MermaidDiagram chart={project.mermaidDiagram} />
              <details className="diagram-source">
                <summary>Mermaid source</summary>
                <pre className="code-block code-block--mermaid">{project.mermaidDiagram}</pre>
              </details>
            </section>
          )}

          {project.links.length > 0 && (
            <section className="panel">
              <p className="panel__eyebrow">Outbound</p>
              <h3>Links</h3>
              <div className="modal-links">
                {project.links.map((link) => (
                  <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="text-link">
                    <ExternalLinkIcon className="h-4 w-4" />
                    <span>{link.text}</span>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
