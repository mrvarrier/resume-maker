'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Save, Download, ArrowLeft, Plus, Trash2, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ResumeDocument } from '@/components/resume/ResumeDocument';
import { Resume, Experience, Leadership, Award, Education } from '@/types/resume';
import { loadResumeData, saveResumeData } from '@/lib/resume-utils';
import { DEFAULT_SECTION_HEADINGS } from '@/lib/constants';
import Link from 'next/link';

interface ResumeEditorProps {
  resumeId: string;
}

export function ResumeEditor({ resumeId }: ResumeEditorProps) {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.6);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastResumeRef = useRef<string>('');

  useEffect(() => {
    const data = loadResumeData();
    const foundResume = data.resumes.find(r => r.id === resumeId);
    if (foundResume) {
      // Migrate awards from old description format to new bullets format
      // and migrate education from single to array format
      const migratedResume = {
        ...foundResume,
        awards: foundResume.awards.map(award => ({
          ...award,
          bullets: award.bullets || (award.description ? [award.description] : ['']),
        })),
        education: Array.isArray(foundResume.education) 
          ? foundResume.education 
          : foundResume.education && (foundResume.education.institution || foundResume.education.degree)
            ? [{ ...foundResume.education, id: `edu_${Date.now()}` }]
            : [],
        sectionHeadings: foundResume.sectionHeadings || DEFAULT_SECTION_HEADINGS,
      };
      setResume(migratedResume);
      lastResumeRef.current = JSON.stringify(migratedResume);
      setLastSaved(new Date(foundResume.updatedAt));
    }
    setLoading(false);
  }, [resumeId]);

  const saveResume = useCallback(async () => {
    if (!resume) return;
    
    setSaving(true);
    try {
      const data = loadResumeData();
      const updatedResumes = data.resumes.map(r => 
        r.id === resume.id ? { ...resume, updatedAt: new Date().toISOString() } : r
      );
      
      const updatedData = { ...data, resumes: updatedResumes };
      saveResumeData(updatedData);
      
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      lastResumeRef.current = JSON.stringify(resume);
    } catch (error) {
      console.error('Failed to save resume:', error);
    } finally {
      setSaving(false);
    }
  }, [resume]);

  // Auto-save effect with improved debouncing
  useEffect(() => {
    if (!resume) return;
    
    const currentResumeString = JSON.stringify(resume);
    
    // Only trigger save if resume actually changed
    if (currentResumeString !== lastResumeRef.current) {
      setHasUnsavedChanges(true);
      
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Set new timeout for auto-save
      saveTimeoutRef.current = setTimeout(() => {
        saveResume();
      }, 2000); // 2 second delay for auto-save
    }
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [resume, saveResume]);

  const updateResume = (updates: Partial<Resume>) => {
    if (!resume) return;
    setResume({ ...resume, ...updates });
  };
  
  // Manual save function for the save button
  const handleManualSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveResume();
  }, [saveResume]);
  
  // Save status text
  const getSaveStatus = () => {
    if (saving) return 'Saving...';
    if (hasUnsavedChanges) return 'Unsaved changes';
    if (lastSaved) {
      const timeDiff = Date.now() - lastSaved.getTime();
      if (timeDiff < 60000) { // Less than 1 minute
        return 'Saved just now';
      } else if (timeDiff < 3600000) { // Less than 1 hour
        const minutes = Math.floor(timeDiff / 60000);
        return `Saved ${minutes}m ago`;
      } else {
        return `Saved at ${lastSaved.toLocaleTimeString()}`;
      }
    }
    return 'Not saved';
  };
  
  // Save status icon
  const getSaveIcon = () => {
    if (saving) return <Clock className="w-4 h-4 text-blue-500" />;
    if (hasUnsavedChanges) return <Clock className="w-4 h-4 text-orange-500" />;
    return <Check className="w-4 h-4 text-green-500" />;
  };
  
  // Keyboard shortcut for saving (Ctrl+S / Cmd+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleManualSave();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleManualSave]);
  
  // Save on page unload to prevent data loss
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const addExperience = () => {
    if (!resume) return;
    const newExp: Experience = {
      id: `exp_${Date.now()}`,
      title: '',
      company: '',
      duration: '',
      bullets: [''],
    };
    updateResume({
      experience: [...resume.experience, newExp],
    });
  };

  const updateExperience = (index: number, updates: Partial<Experience>) => {
    if (!resume) return;
    const updatedExperience = [...resume.experience];
    updatedExperience[index] = { ...updatedExperience[index], ...updates };
    updateResume({ experience: updatedExperience });
  };

  const deleteExperience = (index: number) => {
    if (!resume) return;
    const updatedExperience = resume.experience.filter((_, i) => i !== index);
    updateResume({ experience: updatedExperience });
  };

  const addBullet = (type: 'experience' | 'leadership' | 'award', index: number) => {
    if (!resume) return;
    if (type === 'experience') {
      const updatedExperience = [...resume.experience];
      updatedExperience[index].bullets.push('');
      updateResume({ experience: updatedExperience });
    } else if (type === 'leadership') {
      const updatedLeadership = [...resume.leadership];
      updatedLeadership[index].bullets.push('');
      updateResume({ leadership: updatedLeadership });
    } else {
      const updatedAwards = [...resume.awards];
      updatedAwards[index].bullets.push('');
      updateResume({ awards: updatedAwards });
    }
  };

  const updateBullet = (type: 'experience' | 'leadership' | 'award', itemIndex: number, bulletIndex: number, value: string) => {
    if (!resume) return;
    if (type === 'experience') {
      const updatedExperience = [...resume.experience];
      updatedExperience[itemIndex].bullets[bulletIndex] = value;
      updateResume({ experience: updatedExperience });
    } else if (type === 'leadership') {
      const updatedLeadership = [...resume.leadership];
      updatedLeadership[itemIndex].bullets[bulletIndex] = value;
      updateResume({ leadership: updatedLeadership });
    } else {
      const updatedAwards = [...resume.awards];
      updatedAwards[itemIndex].bullets[bulletIndex] = value;
      updateResume({ awards: updatedAwards });
    }
  };

  const deleteBullet = (type: 'experience' | 'leadership' | 'award', itemIndex: number, bulletIndex: number) => {
    if (!resume) return;
    if (type === 'experience') {
      const updatedExperience = [...resume.experience];
      updatedExperience[itemIndex].bullets = updatedExperience[itemIndex].bullets.filter((_, i) => i !== bulletIndex);
      updateResume({ experience: updatedExperience });
    } else if (type === 'leadership') {
      const updatedLeadership = [...resume.leadership];
      updatedLeadership[itemIndex].bullets = updatedLeadership[itemIndex].bullets.filter((_, i) => i !== bulletIndex);
      updateResume({ leadership: updatedLeadership });
    } else {
      const updatedAwards = [...resume.awards];
      updatedAwards[itemIndex].bullets = updatedAwards[itemIndex].bullets.filter((_, i) => i !== bulletIndex);
      updateResume({ awards: updatedAwards });
    }
  };

  const addLeadership = () => {
    if (!resume) return;
    const newLead: Leadership = {
      id: `lead_${Date.now()}`,
      title: '',
      organization: '',
      duration: '',
      bullets: [''],
    };
    updateResume({
      leadership: [...resume.leadership, newLead],
    });
  };

  const updateLeadership = (index: number, updates: Partial<Leadership>) => {
    if (!resume) return;
    const updatedLeadership = [...resume.leadership];
    updatedLeadership[index] = { ...updatedLeadership[index], ...updates };
    updateResume({ leadership: updatedLeadership });
  };

  const deleteLeadership = (index: number) => {
    if (!resume) return;
    const updatedLeadership = resume.leadership.filter((_, i) => i !== index);
    updateResume({ leadership: updatedLeadership });
  };

  const addAward = () => {
    if (!resume) return;
    const newAward: Award = {
      id: `award_${Date.now()}`,
      title: '',
      organization: '',
      date: '',
      bullets: [''],
    };
    updateResume({
      awards: [...resume.awards, newAward],
    });
  };

  const updateAward = (index: number, updates: Partial<Award>) => {
    if (!resume) return;
    const updatedAwards = [...resume.awards];
    updatedAwards[index] = { ...updatedAwards[index], ...updates };
    updateResume({ awards: updatedAwards });
  };

  const deleteAward = (index: number) => {
    if (!resume) return;
    const updatedAwards = resume.awards.filter((_, i) => i !== index);
    updateResume({ awards: updatedAwards });
  };

  const addEducation = () => {
    if (!resume) return;
    const newEducation: Education = {
      id: `edu_${Date.now()}`,
      institution: '',
      degree: '',
      duration: '',
      gpa: '',
    };
    updateResume({
      education: [...resume.education, newEducation],
    });
  };

  const updateEducation = (index: number, updates: Partial<Education>) => {
    if (!resume) return;
    const updatedEducation = [...resume.education];
    updatedEducation[index] = { ...updatedEducation[index], ...updates };
    updateResume({ education: updatedEducation });
  };

  const deleteEducation = (index: number) => {
    if (!resume) return;
    const updatedEducation = resume.education.filter((_, i) => i !== index);
    updateResume({ education: updatedEducation });
  };

  const addSkill = (type: 'technical' | 'soft') => {
    if (!resume) return;
    const updatedSkills = { ...resume.skills };
    updatedSkills[type].push('');
    updateResume({ skills: updatedSkills });
  };

  const updateSkill = (type: 'technical' | 'soft', index: number, value: string) => {
    if (!resume) return;
    const updatedSkills = { ...resume.skills };
    updatedSkills[type][index] = value;
    updateResume({ skills: updatedSkills });
  };

  const deleteSkill = (type: 'technical' | 'soft', index: number) => {
    if (!resume) return;
    const updatedSkills = { ...resume.skills };
    updatedSkills[type] = updatedSkills[type].filter((_, i) => i !== index);
    updateResume({ skills: updatedSkills });
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Resume not found</h1>
          <Link href="/">
            <Button>Go back to dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold">{resume.name}</h1>
              <div className="flex items-center space-x-2">
                {getSaveIcon()}
                <p className="text-sm text-gray-500">
                  {getSaveStatus()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm">Zoom:</label>
              <select
                value={previewScale}
                onChange={(e) => setPreviewScale(Number(e.target.value))}
                className="text-sm border rounded px-2 py-1"
              >
                <option value={0.4}>40%</option>
                <option value={0.5}>50%</option>
                <option value={0.6}>60%</option>
                <option value={0.7}>70%</option>
                <option value={0.8}>80%</option>
                <option value={1.0}>100%</option>
              </select>
            </div>
            
            <Button 
              onClick={handleManualSave} 
              disabled={saving}
              variant={hasUnsavedChanges ? "default" : "outline"}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : hasUnsavedChanges ? 'Save Now' : 'Saved'}
            </Button>
            
            <Link href={`/preview/${resume.id}`}>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-6 h-full">
          {/* Editor Panel */}
          <div className="space-y-6 overflow-y-auto max-h-screen pb-20">
            {/* Resume Name */}
            <Card>
              <CardHeader>
                <CardTitle>Resume Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Resume name"
                  value={resume.name}
                  onChange={(e) => updateResume({ name: e.target.value })}
                />
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Full Name"
                  value={resume.personalInfo.name}
                  onChange={(e) => updateResume({
                    personalInfo: { ...resume.personalInfo, name: e.target.value }
                  })}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={resume.personalInfo.email}
                  onChange={(e) => updateResume({
                    personalInfo: { ...resume.personalInfo, email: e.target.value }
                  })}
                />
                <Input
                  placeholder="LinkedIn"
                  value={resume.personalInfo.linkedin}
                  onChange={(e) => updateResume({
                    personalInfo: { ...resume.personalInfo, linkedin: e.target.value }
                  })}
                />
                <Input
                  placeholder="Portfolio/Website"
                  value={resume.personalInfo.portfolio}
                  onChange={(e) => updateResume({
                    personalInfo: { ...resume.personalInfo, portfolio: e.target.value }
                  })}
                />
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <Input
                      placeholder="Experience section heading"
                      value={resume.sectionHeadings.experience}
                      onChange={(e) => updateResume({
                        sectionHeadings: { ...resume.sectionHeadings, experience: e.target.value }
                      })}
                      className="font-medium text-lg border-none p-0 focus:ring-0"
                    />
                  </div>
                  <Button onClick={addExperience} size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {resume.experience.map((exp, index) => (
                  <div key={exp.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Experience {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteExperience(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Job Title"
                        value={exp.title}
                        onChange={(e) => updateExperience(index, { title: e.target.value })}
                      />
                      <Input
                        placeholder="Duration"
                        value={exp.duration}
                        onChange={(e) => updateExperience(index, { duration: e.target.value })}
                      />
                    </div>
                    
                    <Input
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => updateExperience(index, { company: e.target.value })}
                    />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Bullet Points</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addBullet('experience', index)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      {exp.bullets.map((bullet, bulletIndex) => (
                        <div key={bulletIndex} className="flex space-x-2">
                          <Textarea
                            placeholder="Achievement or responsibility"
                            value={bullet}
                            onChange={(e) => updateBullet('experience', index, bulletIndex, e.target.value)}
                            className="min-h-[60px]"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteBullet('experience', index, bulletIndex)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <Input
                      placeholder="Education section heading"
                      value={resume.sectionHeadings.education}
                      onChange={(e) => updateResume({
                        sectionHeadings: { ...resume.sectionHeadings, education: e.target.value }
                      })}
                      className="font-medium text-lg border-none p-0 focus:ring-0"
                    />
                  </div>
                  <Button onClick={addEducation} size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {resume.education.map((edu, index) => (
                  <div key={edu.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Education {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteEducation(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, { degree: e.target.value })}
                      />
                      <Input
                        placeholder="Duration"
                        value={edu.duration}
                        onChange={(e) => updateEducation(index, { duration: e.target.value })}
                      />
                    </div>
                    
                    <Input
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, { institution: e.target.value })}
                    />
                    
                    <Input
                      placeholder="GPA (optional)"
                      value={edu.gpa || ''}
                      onChange={(e) => updateEducation(index, { gpa: e.target.value })}
                    />
                  </div>
                ))}
                
                {resume.education.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No education entries yet.</p>
                    <Button onClick={addEducation} variant="outline" className="mt-2">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Leadership */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <Input
                      placeholder="Leadership section heading"
                      value={resume.sectionHeadings.leadership}
                      onChange={(e) => updateResume({
                        sectionHeadings: { ...resume.sectionHeadings, leadership: e.target.value }
                      })}
                      className="font-medium text-lg border-none p-0 focus:ring-0"
                    />
                  </div>
                  <Button onClick={addLeadership} size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {resume.leadership.map((lead, index) => (
                  <div key={lead.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Leadership {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteLeadership(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Title/Role"
                        value={lead.title}
                        onChange={(e) => updateLeadership(index, { title: e.target.value })}
                      />
                      <Input
                        placeholder="Duration"
                        value={lead.duration}
                        onChange={(e) => updateLeadership(index, { duration: e.target.value })}
                      />
                    </div>
                    
                    <Input
                      placeholder="Organization"
                      value={lead.organization}
                      onChange={(e) => updateLeadership(index, { organization: e.target.value })}
                    />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Bullet Points</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addBullet('leadership', index)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      {lead.bullets.map((bullet, bulletIndex) => (
                        <div key={bulletIndex} className="flex space-x-2">
                          <Textarea
                            placeholder="Achievement or responsibility"
                            value={bullet}
                            onChange={(e) => updateBullet('leadership', index, bulletIndex, e.target.value)}
                            className="min-h-[60px]"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteBullet('leadership', index, bulletIndex)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Awards */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <Input
                      placeholder="Awards section heading"
                      value={resume.sectionHeadings.awards}
                      onChange={(e) => updateResume({
                        sectionHeadings: { ...resume.sectionHeadings, awards: e.target.value }
                      })}
                      className="font-medium text-lg border-none p-0 focus:ring-0"
                    />
                  </div>
                  <Button onClick={addAward} size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {resume.awards.map((award, index) => (
                  <div key={award.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Award {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAward(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Award Title"
                        value={award.title}
                        onChange={(e) => updateAward(index, { title: e.target.value })}
                      />
                      <Input
                        placeholder="Date"
                        value={award.date}
                        onChange={(e) => updateAward(index, { date: e.target.value })}
                      />
                    </div>
                    
                    <Input
                      placeholder="Organization"
                      value={award.organization}
                      onChange={(e) => updateAward(index, { organization: e.target.value })}
                    />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Bullet Points</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addBullet('award', index)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      {award.bullets.map((bullet, bulletIndex) => (
                        <div key={bulletIndex} className="flex space-x-2">
                          <Textarea
                            placeholder="Achievement or responsibility"
                            value={bullet}
                            onChange={(e) => updateBullet('award', index, bulletIndex, e.target.value)}
                            className="min-h-[60px]"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteBullet('award', index, bulletIndex)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <Input
                      placeholder="Skills section heading"
                      value={resume.sectionHeadings.skills}
                      onChange={(e) => updateResume({
                        sectionHeadings: { ...resume.sectionHeadings, skills: e.target.value }
                      })}
                      className="font-medium text-lg border-none p-0 focus:ring-0"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Technical Skills */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Technical Skills</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addSkill('technical')}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  {resume.skills.technical.map((skill, index) => (
                    <div key={index} className="flex space-x-2">
                      <Input
                        placeholder="Technical skill"
                        value={skill}
                        onChange={(e) => updateSkill('technical', index, e.target.value)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSkill('technical', index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Soft Skills */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Soft Skills</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addSkill('soft')}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  {resume.skills.soft.map((skill, index) => (
                    <div key={index} className="flex space-x-2">
                      <Input
                        placeholder="Soft skill"
                        value={skill}
                        onChange={(e) => updateSkill('soft', index, e.target.value)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSkill('soft', index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-lg shadow-sm p-6 overflow-auto max-h-screen">
            <div className="flex justify-center">
              <div 
                style={{
                  transform: previewScale !== 1 ? `scale(${previewScale})` : undefined,
                  transformOrigin: 'top center',
                }}
              >
                <ResumeDocument 
                  resume={resume} 
                  mode="preview" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}