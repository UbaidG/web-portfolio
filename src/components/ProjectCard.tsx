import React from "react";
import { ProjectItem } from "../data/portfolioData";

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
}) => (
  <article
    className="project-card"
  >
    <div className="project-card__topline">
      <span>{String(index + 1).padStart(2, "0")}</span>
      <span>{project.category}</span>
    </div>
    <h3>{project.title}</h3>
    {project.subtitle && <p className="project-card__subtitle">{project.subtitle}</p>}
    <p className="project-card__tagline">{project.tagline}</p>
    <p className="project-card__description">{project.description}</p>
    <div className="project-card__tech" aria-label={`${project.title} technologies`}>
      {project.tech.map((technology) => (
        <span key={technology}>{technology}</span>
      ))}
    </div>
    {project.github && (
      <a
        className="project-card__link"
        href={project.github}
        target="_blank"
        rel="noreferrer"
      >
        {project.linkLabel ?? "View project"} <span aria-hidden="true">↗</span>
      </a>
    )}
  </article>
);
