'use client';

import { useState, useEffect } from 'react';
import { Plus, FileText, Edit, Download, Copy, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Resume, ResumeData } from '@/types/resume';
import { loadResumeData, saveResumeData, createEmptyResume, generateResumeId, formatDate } from '@/lib/resume-utils';
import { sampleResume } from '@/lib/sample-data';
import { DEFAULT_SECTION_HEADINGS } from '@/lib/constants';
import Link from 'next/link';

export default function HomePage() {
  const [resumeData, setResumeData] = useState<ResumeData>({ resumes: [], lastId: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = loadResumeData();
    
    // Migrate existing resumes to new format (awards, education, section headings, links)
    const migratedResumes = data.resumes.map(resume => ({
      ...resume,
      awards: resume.awards.map(award => ({
        ...award,
        bullets: award.bullets || (award.description ? [award.description] : ['']),
      })),
      education: Array.isArray(resume.education) 
        ? resume.education 
        : resume.education && (resume.education.institution || resume.education.degree)
          ? [{ ...resume.education, id: `edu_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` }]
          : [],
      sectionHeadings: resume.sectionHeadings || DEFAULT_SECTION_HEADINGS,
      personalInfo: {
        ...resume.personalInfo,
        linkedin: typeof resume.personalInfo.linkedin === 'string' 
          ? { text: resume.personalInfo.linkedin ? 'LinkedIn' : '', url: resume.personalInfo.linkedin || '' }
          : resume.personalInfo.linkedin || { text: '', url: '' },
        portfolio: typeof resume.personalInfo.portfolio === 'string' 
          ? { text: resume.personalInfo.portfolio ? 'Portfolio' : '', url: resume.personalInfo.portfolio || '' }
          : resume.personalInfo.portfolio || { text: '', url: '' },
        github: resume.personalInfo.github && typeof resume.personalInfo.github === 'string'
          ? { text: resume.personalInfo.github ? 'GitHub' : '', url: resume.personalInfo.github || '' }
          : resume.personalInfo.github || { text: '', url: '' },
      },
    }));
    
    // If no resumes exist, add sample resume for demonstration
    if (data.resumes.length === 0) {
      const initialData = {
        resumes: [sampleResume],
        lastId: 1,
      };
      saveResumeData(initialData);
      setResumeData(initialData);
    } else {
      const migratedData = { ...data, resumes: migratedResumes };
      setResumeData(migratedData);
      // Save migrated data back to localStorage
      if (JSON.stringify(data) !== JSON.stringify(migratedData)) {
        saveResumeData(migratedData);
      }
    }
    
    setLoading(false);
  }, []);

  const filteredResumes = resumeData.resumes.filter(resume =>
    resume.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resume.personalInfo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createNewResume = () => {
    const newResume: Resume = {
      id: generateResumeId(),
      ...createEmptyResume(),
    };
    
    const updatedData = {
      resumes: [...resumeData.resumes, newResume],
      lastId: resumeData.lastId + 1,
    };
    
    setResumeData(updatedData);
    saveResumeData(updatedData);
    
    // Navigate to editor
    window.location.href = `/editor/${newResume.id}`;
  };

  const duplicateResume = (resume: Resume) => {
    const duplicatedResume: Resume = {
      ...resume,
      id: generateResumeId(),
      name: `${resume.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedData = {
      resumes: [...resumeData.resumes, duplicatedResume],
      lastId: resumeData.lastId + 1,
    };
    
    setResumeData(updatedData);
    saveResumeData(updatedData);
  };

  const deleteResume = (resumeId: string) => {
    if (confirm('Are you sure you want to delete this resume?')) {
      const updatedData = {
        ...resumeData,
        resumes: resumeData.resumes.filter(r => r.id !== resumeId),
      };
      
      setResumeData(updatedData);
      saveResumeData(updatedData);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading your resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ATS Resume Builder
          </h1>
          <p className="text-gray-600">
            Create professional, ATS-friendly resumes that get you noticed
          </p>
        </div>

        {/* Stats and Actions */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-6">
            <div>
              <p className="text-sm text-gray-500">Total Resumes</p>
              <p className="text-2xl font-bold text-gray-900">{resumeData.resumes.length}</p>
            </div>
          </div>
          
          <Button onClick={createNewResume} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create New Resume</span>
          </Button>
        </div>

        {/* Search */}
        {resumeData.resumes.length > 0 && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search resumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* Resume Grid */}
        {filteredResumes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => (
              <Card key={resume.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {resume.name}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    {resume.personalInfo.name || 'Untitled'}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-xs text-gray-500">
                      <p>Created: {formatDate(resume.createdAt)}</p>
                      <p>Updated: {formatDate(resume.updatedAt)}</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link href={`/editor/${resume.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => duplicateResume(resume)}
                        title="Duplicate"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      
                      <Link href={`/preview/${resume.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          title="Download PDF"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </Link>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteResume(resume.id)}
                        title="Delete"
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : resumeData.resumes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No resumes yet
            </h2>
            <p className="text-gray-500 mb-6">
              Create your first professional resume to get started
            </p>
            <Button onClick={createNewResume} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Your First Resume</span>
            </Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No resumes found
            </h2>
            <p className="text-gray-500 mb-6">
              Try adjusting your search query
            </p>
            <Button 
              variant="outline" 
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}