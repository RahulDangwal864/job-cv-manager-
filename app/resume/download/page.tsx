// pages/resume/download.tsx
"use client";
import { useEffect, useState } from 'react';
import { useSearchParams  } from 'next/navigation';
import { ModernTemplate } from '@/components/resume/templates/Modern';
import { MinimalTemplate } from '@/components/resume/templates/Minimal';
import { ProfessionalTemplate } from '@/components/resume/templates/Professional';

const TEMPLATES = {
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  professional: ProfessionalTemplate
} as const;

type TemplateKey = keyof typeof TEMPLATES;

const DownloadPage = () => {
  const searchParams = useSearchParams();
  const [resumeData, setResumeData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey | null>(null);
  
  useEffect(() => {
    const data = searchParams.get('data');
    const template = searchParams.get('template');

    if (Array.isArray(data) || Array.isArray(template)) {
      console.error('Invalid query parameters');
      return;
    }

    if (data && template && template in TEMPLATES) {
      setResumeData(JSON.parse(data as string));
      setSelectedTemplate(template as TemplateKey);
    }
  }, [searchParams]);

  if (!resumeData || !selectedTemplate) {
    return <div>Loading...</div>;
  }

  const TemplateComponent = TEMPLATES[selectedTemplate];
  
  return (
    <div className="">
        <div id="resume-content">
        <TemplateComponent resumeData={resumeData} isEditing={false} updateField={() => {}} />
        </div>
    </div>
  );
};

export default DownloadPage;
