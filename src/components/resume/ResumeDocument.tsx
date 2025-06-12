'use client';

import React from 'react';
import { Resume } from '@/types/resume';
import { A4_DIMENSIONS } from '@/lib/constants';

interface ResumeDocumentProps {
  resume: Resume;
  mode?: 'preview' | 'pdf';
}

export function ResumeDocument({ resume, mode = 'preview' }: ResumeDocumentProps) {
  const { personalInfo, experience, education, leadership, awards, skills } = resume;

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
            {[personalInfo.email, personalInfo.linkedin, personalInfo.portfolio]
              .filter(Boolean)
              .join(' | ')}
          </div>
        </header>

        {/* Education Section - ATS Friendly */}
        {(education.institution || education.degree) && (
          <section className="ats-section">
            <h2 className="ats-section-header">EDUCATION</h2>
            <div className="ats-content">
              <div className="ats-education">
                <h3 className="ats-degree">{education.degree}</h3>
                <div className="ats-school">{education.institution}</div>
                <div className="ats-dates">{education.duration}</div>
                {education.gpa && (
                  <div className="ats-gpa">GPA: {education.gpa}</div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Experience Section - ATS Friendly */}
        {experience.length > 0 && (
          <section className="ats-section">
            <h2 className="ats-section-header">EXPERIENCE</h2>
            <div className="ats-content">
              {experience.map((exp, index) => (
                <div key={exp.id} className="ats-job">
                  <h3 className="ats-job-title">{exp.title}</h3>
                  <div className="ats-job-details">
                    <div className="ats-company">{exp.company}</div>
                    <div className="ats-dates">{exp.duration}</div>
                  </div>
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
            <h2 className="ats-section-header">LEADERSHIP AND ACTIVITIES</h2>
            <div className="ats-content">
              {leadership.map((lead, index) => (
                <div key={lead.id} className="ats-leadership">
                  <h3 className="ats-leadership-title">{lead.title}</h3>
                  <div className="ats-leadership-details">
                    <div className="ats-organization">{lead.organization}</div>
                    <div className="ats-dates">{lead.duration}</div>
                  </div>
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
            <h2 className="ats-section-header">HONORS AND AWARDS</h2>
            <div className="ats-content">
              {awards.map((award, index) => (
                <div key={award.id} className="ats-award">
                  <h3 className="ats-award-title">{award.title}</h3>
                  <div className="ats-award-details">
                    <div className="ats-organization">{award.organization}</div>
                    <div className="ats-dates">{award.date}</div>
                  </div>
                  {award.description && (
                    <div className="ats-description">{award.description}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section - ATS Friendly */}
        {(skills.technical.length > 0 || skills.soft.length > 0) && (
          <section className="ats-section">
            <h2 className="ats-section-header">SKILLS</h2>
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