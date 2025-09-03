import React, { useEffect, useRef, useState } from 'react';
import type { Project } from '../types';
import { ExternalLinkIcon, XIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset image index when project changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [project]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % project.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + project.images.length) % project.images.length);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-slate-800 text-slate-300 shadow-2xl shadow-black/50 m-4"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-20 text-slate-400 hover:text-white transition-colors"
          aria-label="Close project details"
        >
          <XIcon className="h-8 w-8" />
        </button>

        {project.images.length > 0 && (
          <div className="relative w-full aspect-video bg-slate-900 rounded-t-lg overflow-hidden group">
            <img 
                src={project.images[currentImageIndex].url} 
                alt={project.images[currentImageIndex].alt} 
                className="w-full h-full object-contain transition-opacity duration-300"
                key={project.images[currentImageIndex].url}
            />
            {project.images.length > 1 && (
                <>
                    <button 
                        onClick={handlePrevImage} 
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        aria-label="Previous image"
                    >
                        <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                    <button 
                        onClick={handleNextImage} 
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        aria-label="Next image"
                    >
                        <ChevronRightIcon className="h-6 w-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
                        {project.images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`h-2 w-2 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}`}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
        )}

        <div className="p-8">
          <h2 className="text-3xl font-bold text-slate-100">{project.title}</h2>
          <p className="mt-4 text-slate-400">{project.longDescription || project.description}</p>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-200">Key Features</h3>
            <ul className="mt-2 list-disc list-inside space-y-1 text-slate-400">
              {project.keyFeatures.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-200">Tech Stack</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span key={tech} className="rounded-full bg-teal-400/10 px-3 py-1 text-sm font-medium text-teal-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {project.links.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-slate-200">Links</h3>
              <div className="mt-2 space-y-2">
                {project.links.map((link) => (
                  <a 
                    key={link.url} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-teal-400 hover:text-teal-300 transition-colors"
                  >
                    <ExternalLinkIcon className="h-4 w-4 mr-2" />
                    <span>{link.text}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};