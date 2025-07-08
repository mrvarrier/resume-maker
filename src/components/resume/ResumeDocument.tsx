'use client';

import React from 'react';
import { Resume } from '@/types/resume';
import { A4_DIMENSIONS } from '@/lib/constants';

interface ResumeDocumentProps {
  resume: Resume;
  mode?: 'preview' | 'pdf';
}

export function ResumeDocument({ resume, mode = 'preview' }: ResumeDocumentProps) {
  const { personalInfo, experience, education, leadership, awards, skills, sectionHeadings } = resume;

  return (
    <div 
      className="resume-page bg-white ats-friendly"
      style={{
        width: A4_DIMENSIONS.width,
        height: A4_DIMENSIONS.height,
        boxShadow: mode === 'preview' ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none',
        border: mode === 'preview' ? '1px solid #e5e5e5' : 'none',
      }}
    >
      <div 
        className="resume-content"
        style={{
          width: A4_DIMENSIONS.contentWidth,
          height: A4_DIMENSIONS.contentHeight,
          padding: `${A4_DIMENSIONS.marginTop}px ${A4_DIMENSIONS.marginX}px ${A4_DIMENSIONS.marginBottom}px ${A4_DIMENSIONS.marginX}px`,
          fontFamily: '"Times New Roman", Times, serif',
          fontSize: '10px',
          lineHeight: '1.2',
          color: '#000000',
        }}
      >
        {/* Header Section - ATS Friendly */}
        <header className="ats-header">
          <h1 className="ats-name">
            {personalInfo.name || 'Your Name'}
          </h1>
          <div className="ats-contact">
            {[
              personalInfo.email ? (
                <span key="email" className="ats-link">{personalInfo.email}</span>
              ) : null,
              personalInfo.linkedin.text && personalInfo.linkedin.url ? (
                <a 
                  key="linkedin"
                  href={personalInfo.linkedin.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ats-link"
                >
                  {personalInfo.linkedin.text}
                </a>
              ) : personalInfo.linkedin.text || personalInfo.linkedin.url ? (
                <span key="linkedin-text" className="ats-link">{personalInfo.linkedin.text || personalInfo.linkedin.url}</span>
              ) : null,
              personalInfo.portfolio.text && personalInfo.portfolio.url ? (
                <a 
                  key="portfolio"
                  href={personalInfo.portfolio.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ats-link"
                >
                  {personalInfo.portfolio.text}
                </a>
              ) : personalInfo.portfolio.text || personalInfo.portfolio.url ? (
                <span key="portfolio-text" className="ats-link">{personalInfo.portfolio.text || personalInfo.portfolio.url}</span>
              ) : null,
              personalInfo.github.text && personalInfo.github.url ? (
                <a 
                  key="github"
                  href={personalInfo.github.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ats-link"
                >
                  {personalInfo.github.text}
                </a>
              ) : personalInfo.github.text || personalInfo.github.url ? (
                <span key="github-text" className="ats-link">{personalInfo.github.text || personalInfo.github.url}</span>
              ) : null
            ]
              .filter(Boolean)
              .reduce((acc, curr, index) => {
                if (index === 0) return [curr];
                return [...acc, ' | ', curr];
              }, [])}
          </div>
        </header>

        {/* Education Section - ATS Friendly */}
        {education.length > 0 && (
          <section className="ats-section">
            <h2 className="ats-section-header">{sectionHeadings.education}</h2>
            <div className="ats-content">
              {education.map((edu, index) => (
                <div key={edu.id} className="ats-education">
                  <div className="ats-education-header">
                    <h3 className="ats-degree">{edu.degree}</h3>
                    <div className="ats-dates">{edu.duration}</div>
                  </div>
                  <div className="ats-school">{edu.institution}</div>
                  {edu.gpa && (
                    <div className="ats-gpa">GPA: {edu.gpa}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section - ATS Friendly */}
        {experience.length > 0 && (
          <section className="ats-section">
            <h2 className="ats-section-header">{sectionHeadings.experience}</h2>
            <div className="ats-content">
              {experience.map((exp, index) => (
                <div key={exp.id} className="ats-job">
                  <div className="ats-job-header">
                    <h3 className="ats-job-title">{exp.title}</h3>
                    <div className="ats-dates">{exp.duration}</div>
                  </div>
                  <div className="ats-company">{exp.company}</div>
                  {exp.bullets.length > 0 && exp.bullets.some(bullet => bullet.trim()) && (
                    <ul className="ats-bullets">
                      {exp.bullets.filter(bullet => bullet.trim()).map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="ats-bullet">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Leadership Section - ATS Friendly */}
        {leadership.length > 0 && (
          <section className="ats-section">
            <h2 className="ats-section-header">{sectionHeadings.leadership}</h2>
            <div className="ats-content">
              {leadership.map((lead, index) => (
                <div key={lead.id} className="ats-leadership">
                  <div className="ats-leadership-header">
                    <h3 className="ats-leadership-title">{lead.title}</h3>
                    <div className="ats-dates">{lead.duration}</div>
                  </div>
                  <div className="ats-organization">{lead.organization}</div>
                  {lead.bullets.length > 0 && lead.bullets.some(bullet => bullet.trim()) && (
                    <ul className="ats-bullets">
                      {lead.bullets.filter(bullet => bullet.trim()).map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="ats-bullet">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Awards Section - ATS Friendly */}
        {awards.length > 0 && (
          <section className="ats-section">
            <h2 className="ats-section-header">{sectionHeadings.awards}</h2>
            <div className="ats-content">
              {awards.map((award, index) => (
                <div key={award.id} className="ats-award">
                  <div className="ats-award-header">
                    <h3 className="ats-award-title">{award.title}</h3>
                    <div className="ats-dates">{award.date}</div>
                  </div>
                  <div className="ats-organization">{award.organization}</div>
                  {award.bullets.length > 0 && award.bullets.some(bullet => bullet.trim()) && (
                    <ul className="ats-bullets">
                      {award.bullets.filter(bullet => bullet.trim()).map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="ats-bullet">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section - ATS Friendly */}
        {(skills.technical.length > 0 || skills.soft.length > 0) && (
          <section className="ats-section">
            <h2 className="ats-section-header">{sectionHeadings.skills}</h2>
            <div className="ats-content">
              {skills.technical.length > 0 && (
                <div className="ats-skills-group">
                  <span className="ats-skills-category">Technical</span>
                  <span className="ats-skills-list">{skills.technical.join(', ')}</span>
                </div>
              )}
              {skills.soft.length > 0 && (
                <div className="ats-skills-group">
                  <span className="ats-skills-category">Soft Skills</span>
                  <span className="ats-skills-list">{skills.soft.join(', ')}</span>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}