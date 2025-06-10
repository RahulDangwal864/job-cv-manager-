import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type TemplateType = 'modern' | 'minimal' | 'professional';

interface TemplateSelectorProps {
  currentTemplate: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
}

export function TemplateSelector({ currentTemplate, onTemplateChange }: TemplateSelectorProps) {
  return (
    <Select value={currentTemplate} onValueChange={(value: TemplateType) => onTemplateChange(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select template" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="modern">Modern</SelectItem>
        <SelectItem value="minimal">Minimal</SelectItem>
        <SelectItem value="professional">Professional</SelectItem>
      </SelectContent>
    </Select>
  );
}