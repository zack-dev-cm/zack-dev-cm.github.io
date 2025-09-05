
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ProjectCard } from './components/ProjectCard';
import { ProjectModal } from './components/ProjectModal';
import { FloatingButtons } from './components/FloatingButtons';
import { Section } from './components/Section';
import { GitHubIcon, LinkedInIcon, MailIcon } from './components/Icons';
import { PROJECTS, COMPANIES, LATEST_UPDATES, TECH_STACK, KEY_HIGHLIGHTS, AUTHOR_INFO, SOCIAL_LINKS } from './constants';
import type { Project } from './types';

const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [selectedProject]);

  return (
    <div className="bg-slate-900 min-h-screen text-slate-300 font-sans leading-relaxed">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />

        <main className="lg:pl-80 xl:pl-96 w-full min-w-0">
          <div className="p-6 sm:p-10 md:p-12 lg:p-16">
            
            <Section id="about" title="About Me">
              <p className="mb-6 text-slate-400">
                {AUTHOR_INFO.bio}
              </p>
              <div className="space-y-4 text-slate-400">
                  {KEY_HIGHLIGHTS.map((highlight, index) => (
                      <p key={index} className="flex items-start">
                           <svg className="w-4 h-4 mr-3 mt-1 flex-shrink-0 text-teal-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                          <span>{highlight}</span>
                      </p>
                  ))}
              </div>
            </Section>

            <Section id="experience" title="Collaborations">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 items-center">
                {COMPANIES.map((company) => (
                  <div
                    key={company.name}
                    tabIndex={0}
                    title={company.name}
                    className="p-4 bg-slate-800 rounded-lg flex justify-center items-center h-24 border border-slate-700 shadow-sm transition duration-300 hover:scale-105 hover:bg-slate-700 hover:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  >
                    <img
                      src={company.logoUrl}
                      alt={`${company.name} Logo`}
                      className="max-h-16 max-w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </Section>

            <Section id="stack" title="Tech Stack">
                <div className="flex flex-wrap gap-3">
                    {TECH_STACK.map((tech, index) => (
                        <span key={index} className="bg-teal-400/10 text-teal-300 text-sm font-medium px-3 py-1.5 rounded-full">{tech}</span>
                    ))}
                </div>
            </Section>
            
            <Section id="latest" title="Latest Updates">
               <ul className="space-y-4 text-slate-400">
                {LATEST_UPDATES.map((update, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-teal-400 mr-3 text-xl">&#8627;</span>
                    <div>
                      <h4 className="font-semibold text-slate-200">{update.title}</h4>
                      <p className="text-sm">{update.description}</p>
                      <div className="mt-1">
                        {update.links.map(link => (
                          <a href={link.url} key={link.url} target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 text-sm mr-4 transition-colors duration-300">
                            {link.text} &rarr;
                          </a>
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
               </ul>
            </Section>

            <Section id="projects" title="Projects">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PROJECTS.map((project) => (
                  <ProjectCard key={project.id} project={project} onSelectProject={() => setSelectedProject(project)} />
                ))}
              </div>
            </Section>

            <Section id="contact" title="Let's Connect">
               <p className="mb-6 text-slate-400">
                I'm always excited to discuss new challenges and opportunities. Feel free to reach out.
              </p>
              <div className="flex items-center space-x-6">
                 <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-400 transition-colors duration-300 flex items-center space-x-2">
                    <LinkedInIcon className="w-6 h-6" />
                    <span>LinkedIn</span>
                 </a>
                 <a href={`mailto:${SOCIAL_LINKS.email}`} className="text-slate-400 hover:text-teal-400 transition-colors duration-300 flex items-center space-x-2">
                    <MailIcon className="w-6 h-6" />
                    <span>Email</span>
                 </a>
                 <a href={SOCIAL_LINKS.githubPrimary} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-400 transition-colors duration-300 flex items-center space-x-2">
                    <GitHubIcon className="w-6 h-6" />
                    <span>GitHub</span>
                 </a>
              </div>
            </Section>

             <footer className="text-center mt-16 text-sm text-slate-500">
              <p>&copy; {new Date().getFullYear()} Zakhar Pashkin. All rights reserved.</p>
            </footer>

          </div>
        </main>
      </div>
      
      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      <FloatingButtons telegramUrl={SOCIAL_LINKS.telegram} />
    </div>
  );
};

export default App;
