'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Resume } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 10,
    paddingTop: 28, // A4_DIMENSIONS.marginTop
    paddingBottom: 40, // A4_DIMENSIONS.marginBottom
    paddingHorizontal: 35, // A4_DIMENSIONS.marginX
    backgroundColor: '#FFFFFF',
    lineHeight: 1.2,
    color: '#000000',
    width: 794, // A4_DIMENSIONS.width
    height: 1123, // A4_DIMENSIONS.height
  },
  
  // Header Section
  header: {
    textAlign: 'left',
    marginBottom: 20,
  },
  name: {
    fontFamily: 'Times-Bold',
    fontSize: 24,
    margin: '0 0 5 0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    lineHeight: 1.2,
    color: '#000000',
  },
  contactInfo: {
    fontFamily: 'Times-Roman',
    fontSize: 10,
    color: '#000000',
    lineHeight: 1.2,
    marginTop: 5,
  },
  
  // Section Structure
  section: {
    marginBottom: 20,
  },
  sectionLast: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontFamily: 'Times-Bold',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    paddingBottom: 2,
    marginBottom: 10,
    lineHeight: 1.2,
    color: '#000000',
  },
  
  // Experience/Leadership Items
  experienceItem: {
    marginBottom: 10,
  },
  experienceItemLast: {
    marginBottom: 0,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  itemTitle: {
    fontFamily: 'Times-Bold',
    fontSize: 10,
    lineHeight: 1.2,
    color: '#000000',
    flexGrow: 1,
    flexShrink: 1,
  },
  itemDate: {
    fontFamily: 'Times-Roman',
    fontSize: 10,
    color: '#000000',
    marginLeft: 8,
    flexShrink: 0,
    lineHeight: 1.2,
  },
  itemSubtitle: {
    fontFamily: 'Times-Italic',
    fontSize: 10,
    marginBottom: 4,
    lineHeight: 1.2,
    color: '#000000',
  },
  
  // Bullet Points
  bulletList: {
    marginLeft: 0,
    width: '100%',
    maxWidth: 724,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 0,
    alignItems: 'flex-start',
    width: '100%',
  },
  bulletSymbol: {
    fontFamily: 'Times-Roman',
    fontSize: 10,
    lineHeight: 1.2,
    color: '#000000',
    width: 15,
    flexShrink: 0,
  },
  bulletText: {
    fontFamily: 'Times-Roman',
    fontSize: 10,
    lineHeight: 1.2,
    color: '#000000',
    flexGrow: 1,
    flexShrink: 1,
    maxWidth: 709, // 724 - 15 for bullet symbol
  },
  
  // Education Specific
  educationContent: {
    marginBottom: 0,
  },
  gpaText: {
    fontFamily: 'Times-Roman',
    fontSize: 10,
    marginTop: 2,
    lineHeight: 1.2,
    color: '#000000',
  },
  
  // Awards Specific
  awardItem: {
    marginBottom: 10,
  },
  awardItemLast: {
    marginBottom: 0,
  },
  awardDescription: {
    fontFamily: 'Times-Roman',
    fontSize: 10,
    marginTop: 2,
    lineHeight: 1.2,
    color: '#000000',
  },
  
  // Skills Specific - ATS Friendly
  skillsGroup: {
    marginBottom: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillsGroupLast: {
    marginBottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillsCategory: {
    fontFamily: 'Times-Bold',
    fontSize: 10,
    lineHeight: 1.2,
    color: '#000000',
  },
  skillsList: {
    fontFamily: 'Times-Roman',
    fontSize: 10,
    lineHeight: 1.2,
    color: '#000000',
  },
});

interface ResumePDFProps {
  resume: Resume;
}

export function ResumePDF({ resume }: ResumePDFProps) {
  const { personalInfo, experience, education, leadership, awards, skills } = resume;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section - ATS Friendly */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {personalInfo.name || 'Your Name'}
          </Text>
          <Text style={styles.contactInfo}>
            {[personalInfo.email, personalInfo.linkedin, personalInfo.portfolio]
              .filter(Boolean)
              .join(' | ')}
          </Text>
        </View>

        {/* Education Section */}
        {(education.institution || education.degree) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EDUCATION</Text>
            <View style={styles.educationContent}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{education.degree}</Text>
                <Text style={styles.itemDate}>{education.duration}</Text>
              </View>
              <Text style={styles.itemSubtitle}>{education.institution}</Text>
              {education.gpa && (
                <Text style={styles.gpaText}>GPA: {education.gpa}</Text>
              )}
            </View>
          </View>
        )}

        {/* Experience Section */}
        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EXPERIENCE</Text>
            {experience.map((exp, index) => (
              <View 
                key={exp.id} 
                style={index === experience.length - 1 ? styles.experienceItemLast : styles.experienceItem}
              >
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.title}</Text>
                  <Text style={styles.itemDate}>{exp.duration}</Text>
                </View>
                <Text style={styles.itemSubtitle}>{exp.company}</Text>
                {exp.bullets.length > 0 && exp.bullets.some(bullet => bullet.trim()) && (
                  <View style={styles.bulletList}>
                    {exp.bullets.filter(bullet => bullet.trim()).map((bullet, bulletIndex) => (
                      <View key={bulletIndex} style={styles.bulletItem}>
                        <Text style={styles.bulletSymbol}>•</Text>
                        <Text style={styles.bulletText}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Leadership Section */}
        {leadership.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LEADERSHIP AND ACTIVITIES</Text>
            {leadership.map((lead, index) => (
              <View 
                key={lead.id} 
                style={index === leadership.length - 1 ? styles.experienceItemLast : styles.experienceItem}
              >
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{lead.title}</Text>
                  <Text style={styles.itemDate}>{lead.duration}</Text>
                </View>
                <Text style={styles.itemSubtitle}>{lead.organization}</Text>
                {lead.bullets.length > 0 && lead.bullets.some(bullet => bullet.trim()) && (
                  <View style={styles.bulletList}>
                    {lead.bullets.filter(bullet => bullet.trim()).map((bullet, bulletIndex) => (
                      <View key={bulletIndex} style={styles.bulletItem}>
                        <Text style={styles.bulletSymbol}>•</Text>
                        <Text style={styles.bulletText}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Awards Section */}
        {awards.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>HONORS AND AWARDS</Text>
            {awards.map((award, index) => (
              <View 
                key={award.id} 
                style={index === awards.length - 1 ? styles.awardItemLast : styles.awardItem}
              >
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{award.title}</Text>
                  <Text style={styles.itemDate}>{award.date}</Text>
                </View>
                <Text style={styles.itemSubtitle}>{award.organization}</Text>
                {award.description && (
                  <Text style={styles.awardDescription}>{award.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills Section - ATS Friendly */}
        {(skills.technical.length > 0 || skills.soft.length > 0) && (
          <View style={styles.sectionLast}>
            <Text style={styles.sectionTitle}>SKILLS</Text>
            {skills.technical.length > 0 && (
              <View style={skills.soft.length > 0 ? styles.skillsGroup : styles.skillsGroupLast}>
                <Text style={styles.skillsCategory}>Technical: </Text>
                <Text style={styles.skillsList}>{skills.technical.join(', ')}</Text>
              </View>
            )}
            {skills.soft.length > 0 && (
              <View style={styles.skillsGroupLast}>
                <Text style={styles.skillsCategory}>Soft Skills: </Text>
                <Text style={styles.skillsList}>{skills.soft.join(', ')}</Text>
              </View>
            )}
          </View>
        )}
      </Page>
    </Document>
  );
}