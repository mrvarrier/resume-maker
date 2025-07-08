import { Resume } from '@/types/resume';
import { DEFAULT_SECTION_HEADINGS } from './constants';

export const sampleResume: Resume = {
  id: 'sample_resume_1',
  name: 'Sample Resume',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  personalInfo: {
    name: 'John Smith',
    email: 'john.smith@email.com',
    linkedin: 'linkedin.com/in/johnsmith',
    portfolio: 'johnsmith.dev',
  },
  experience: [
    {
      id: 'exp_1',
      title: 'Senior Software Engineer',
      company: 'Tech Solutions Inc.',
      duration: 'Jan 2022 - Present',
      bullets: [
        'Led development of microservices architecture serving 1M+ daily users',
        'Reduced application load time by 40% through optimization and caching strategies',
        'Mentored 3 junior developers and conducted technical interviews',
        'Implemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes',
      ],
    },
    {
      id: 'exp_2',
      title: 'Software Engineer',
      company: 'Digital Innovations LLC',
      duration: 'Jun 2020 - Dec 2021',
      bullets: [
        'Developed RESTful APIs using Node.js and Express.js for e-commerce platform',
        'Built responsive React components used by 500K+ customers',
        'Collaborated with cross-functional teams to deliver features on time',
        'Wrote comprehensive unit tests achieving 95% code coverage',
      ],
    },
  ],
  education: [
    {
      id: 'edu_1',
      institution: 'University of Technology',
      degree: 'Bachelor of Science in Computer Science',
      duration: 'Sep 2016 - May 2020',
      gpa: '3.8',
    },
  ],
  leadership: [
    {
      id: 'lead_1',
      title: 'Technical Team Lead',
      organization: 'Open Source Project',
      duration: 'Mar 2021 - Present',
      bullets: [
        'Led team of 8 volunteer developers on popular React library (10K+ GitHub stars)',
        'Organized weekly code reviews and technical architecture discussions',
        'Managed project roadmap and prioritized feature development',
      ],
    },
  ],
  awards: [
    {
      id: 'award_1',
      title: 'Employee of the Year',
      organization: 'Tech Solutions Inc.',
      date: '2023',
      bullets: [
        'Recognized for outstanding contribution to product development',
        'Led key initiatives that improved team productivity by 25%',
      ],
    },
    {
      id: 'award_2',
      title: "Dean's List",
      organization: 'University of Technology',
      date: '2019, 2020',
      bullets: [
        'Maintained GPA above 3.8 for four consecutive semesters',
      ],
    },
  ],
  skills: {
    technical: [
      'JavaScript/TypeScript',
      'React.js',
      'Node.js',
      'Python',
      'AWS',
      'Docker',
      'PostgreSQL',
      'Redis',
    ],
    soft: [
      'Leadership',
      'Problem Solving',
      'Communication',
      'Team Collaboration',
      'Project Management',
    ],
  },
  sectionHeadings: DEFAULT_SECTION_HEADINGS,
};