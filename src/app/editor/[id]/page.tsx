'use client';

import { ResumeEditor } from '@/components/editor/ResumeEditor';

interface EditorPageProps {
  params: {
    id: string;
  };
}

export default function EditorPage({ params }: EditorPageProps) {
  return <ResumeEditor resumeId={params.id} />;
}