import React from 'react';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onSelectProject: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelectProject }) => {
  return (
    <div 
      className="group relative cursor-pointer overflow-hidden rounded-lg bg-slate-800/50 transition-all duration-300 hover:bg-slate-800/80 hover:shadow-2xl hover:shadow-teal-500/10"
      onClick={onSelectProject}
    >
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 to-transparent"></div>
      <img 
        src={project.thumbnail} 
        alt={`${project.title} thumbnail`} 
        className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-105" 
      />
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
        <h3 className="text-lg font-bold text-slate-100">{project.title}</h3>
        <p className="mt-1 text-sm text-slate-400">{project.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.techStack.slice(0, 3).map((tech) => (
            <span key={tech} className="rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium text-teal-300">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
