import React from 'react';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  eyebrow?: string;
  description?: string;
}

export const Section: React.FC<SectionProps> = ({ id, title, children, eyebrow, description }) => {
  return (
    <section id={id} className="content-section">
      <div className="section-header">
        {eyebrow && <p className="section-header__eyebrow">{eyebrow}</p>}
        <div className="section-header__body">
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
      </div>
      {children}
    </section>
  );
};
