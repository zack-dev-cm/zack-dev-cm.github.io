import React from 'react';
import { contributionSummary } from '../utils/contribution-summary.mjs';
import { resolveAssetUrl } from '../utils/assets';
import type { OPEN_SOURCE_PROJECTS } from '../constants';

export const ContributionProject: React.FC<{
  project: (typeof OPEN_SOURCE_PROJECTS)[number];
  merged?: boolean;
}> = ({ project, merged = false }) => (
  <li className="contribution-project">
    <img className="contribution-project__logo" src={resolveAssetUrl(project.logo)}
      alt={`${project.name} repository avatar`} width="64" height="64" loading="lazy" />
    <div className="contribution-project__body">
      <div className="contribution-card__heading">
        <h4 className="contribution-project__name">{project.name} <span>· {project.project}</span></h4>
        {merged && <span className="contribution-card__status is-merged">{contributionSummary(project.pullRequests)}</span>}
      </div>
      <p className="contribution-card__description">{project.benefit}</p>
      {project.name === 'Unidata' && <a href="/docs/contribution-lab/" className="contribution-card__action">Explore empty selections in 3D <span aria-hidden="true">↗</span></a>}
      {project.name === 'pydicom' && project.project === 'Display & modality lookup tables' && <>
        <a href="https://github.com/pydicom/pydicom/pull/2382" className="contribution-card__action">Follow-up by SID-6921 · #2382 <span aria-hidden="true">↗</span></a>
        <a href="/docs/contribution-lab/pydicom.html" className="contribution-card__action">Play the display lookup example <span aria-hidden="true">↗</span></a>
      </>}
      {project.name === 'Astropy' && <a href="/docs/contribution-lab/reproject.html" className="contribution-card__action">Follow a sky pixel in 3D <span aria-hidden="true">↗</span></a>}
    </div>
    <div className="contribution-project__links" aria-label={`${project.name} pull requests`}>
      {project.pullRequests.map(pr => <a key={pr.url} href={pr.url} target="_blank" rel="noopener noreferrer"
        aria-label={`${project.name} #${pr.number}: ${pr.title}`} title={pr.title}>#{pr.number}<span aria-hidden="true">↗</span></a>)}
    </div>
  </li>
);
