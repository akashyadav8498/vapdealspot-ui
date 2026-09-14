import { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/admin/components/ui/button';

interface EmailPreviewProps {
  html: string;
}

export function EmailPreview({ html }: EmailPreviewProps) {
  const [view, setView] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="h-full flex flex-col bg-muted/10 rounded-md overflow-hidden">
      <div className="flex items-center justify-center gap-2 p-2 border-b bg-background">
        <Button
          variant={view === 'desktop' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setView('desktop')}
          className="h-8 px-2"
        >
          <Monitor className="w-4 h-4 mr-2" />
          Desktop
        </Button>
        <Button
          variant={view === 'mobile' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setView('mobile')}
          className="h-8 px-2"
        >
          <Smartphone className="w-4 h-4 mr-2" />
          Mobile
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto p-4 flex justify-center bg-muted/30">
        <div 
          className="bg-white shadow-sm transition-all duration-300 ease-in-out border"
          style={{ 
            width: view === 'mobile' ? '375px' : '100%', 
            maxWidth: '600px',
            height: '100%',
            minHeight: '400px'
          }}
        >
          <iframe
            title="Email Preview"
            srcDoc={html || '<div style="font-family: sans-serif; padding: 20px; color: #999;">Empty email content</div>'}
            className="w-full h-full border-0"
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
