import { Resume, ResumeData } from '@/types/resume';
import { DEFAULT_RESUME } from './constants';

export function generateResumeId(): string {
  return `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createEmptyResume(name: string = 'Untitled Resume'): Omit<Resume, 'id'> {
  const now = new Date().toISOString();
  return {
    name,
    createdAt: now,
    updatedAt: now,
    ...DEFAULT_RESUME,
  };
}

export function saveResumeData(data: ResumeData): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('resumeData', JSON.stringify(data));
  }
}

export function loadResumeData(): ResumeData {
  if (typeof window === 'undefined') {
    return { resumes: [], lastId: 0 };
  }
  
  try {
    const saved = localStorage.getItem('resumeData');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading resume data:', error);
  }
  
  return { resumes: [], lastId: 0 };
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function generateFileName(resume: Resume): string {
  const firstName = resume.personalInfo.name.split(' ')[0] || 'Resume';
  const lastName = resume.personalInfo.name.split(' ').slice(1).join('_') || '';
  return `${firstName}${lastName ? '_' + lastName : ''}_Resume.pdf`;
}