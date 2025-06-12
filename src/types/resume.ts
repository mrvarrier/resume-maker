export interface PersonalInfo {
  name: string;
  email: string;
  linkedin: string;
  portfolio: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  bullets: string[];
}

export interface Education {
  institution: string;
  degree: string;
  duration: string;
  gpa?: string;
}

export interface Leadership {
  id: string;
  title: string;
  organization: string;
  duration: string;
  bullets: string[];
}

export interface Award {
  id: string;
  title: string;
  organization: string;
  date: string;
  description?: string;
}

export interface Skills {
  technical: string[];
  soft: string[];
}

export interface Resume {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education;
  leadership: Leadership[];
  awards: Award[];
  skills: Skills;
}

export interface ResumeData {
  resumes: Resume[];
  lastId: number;
}

export interface PageBreakInfo {
  page: number;
  content: string;
  height: number;
}

export interface A4Dimensions {
  width: number;
  height: number;
  marginX: number;
  marginY: number;
  contentWidth: number;
  contentHeight: number;
}