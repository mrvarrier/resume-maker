'use client';

import { PreviewPage } from '@/components/preview/PreviewPage';

interface PreviewRouteProps {
  params: {
    id: string;
  };
}

export default function PreviewRoute({ params }: PreviewRouteProps) {
  return <PreviewPage resumeId={params.id} />;
}