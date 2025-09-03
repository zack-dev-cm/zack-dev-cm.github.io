import React from 'react';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ id, title, children }) => {
  return (
    <section id={id} className="py-12 scroll-mt-20">
      <div className="flex items-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-200 sm:text-3xl">{title}</h2>
        <div className="ml-4 h-px flex-grow bg-slate-700"></div>
      </div>
      {children}
    </section>
  );
};
