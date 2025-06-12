'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Download, ZoomIn, ZoomOut, Edit } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ResumeDocument } from '@/components/resume/ResumeDocument';
import { Resume } from '@/types/resume';
import { loadResumeData, generateFileName } from '@/lib/resume-utils';
import { pdf } from '@react-pdf/renderer';
import { ResumePDF } from '@/components/pdf/ResumePDF';
import Link from 'next/link';

interface PreviewPageProps {
  resumeId: string;
}

export function PreviewPage({ resumeId }: PreviewPageProps) {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(0.8);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const data = loadResumeData();
    const foundResume = data.resumes.find(r => r.id === resumeId);
    if (foundResume) {
      // Migrate awards from old description format to new bullets format
      const migratedResume = {
        ...foundResume,
        awards: foundResume.awards.map(award => ({
          ...award,
          bullets: award.bullets || (award.description ? [award.description] : ['']),
        }))
      };
      setResume(migratedResume);
    }
    setLoading(false);
  }, [resumeId]);

  const downloadPDF = async () => {
    if (!resume) return;
    
    setDownloading(true);
    try {
      const pdfDoc = pdf(<ResumePDF resume={resume} />);
      const blob = await pdfDoc.toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = generateFileName(resume);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.3));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
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
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold">{resume.name}</h1>
              <p className="text-sm text-gray-500">Resume Preview</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Zoom Controls */}
            <div className="flex items-center space-x-2 border rounded-lg p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                disabled={scale <= 0.3}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium w-12 text-center">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                disabled={scale >= 1.5}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            <Link href={`/editor/${resume.id}`}>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            
            <Button onClick={downloadPDF} disabled={downloading}>
              <Download className="w-4 h-4 mr-2" />
              {downloading ? 'Generating...' : 'Download PDF'}
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="py-8">
        <div className="flex justify-center">
          <div 
            style={{
              transform: scale !== 1 ? `scale(${scale})` : undefined,
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

      {/* Instructions */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            ATS-Friendly Resume Tips
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Uses standard section headers that ATS systems recognize</li>
            <li>• Clean, simple formatting without complex graphics or tables</li>
            <li>• Consistent fonts and spacing throughout the document</li>
            <li>• Standard bullet points for easy parsing</li>
            <li>• Proper hierarchy with clear section divisions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}