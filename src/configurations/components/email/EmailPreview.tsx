import { useState } from 'react';
import { Smartphone, Monitor, Tablet, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/configurations/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/configurations/components/ui/select';
import { performEmailChecks } from '@/configurations/lib/email/emailValidation';
import { MOCK_CUSTOMERS } from '@/configurations/lib/email/personalization';
import type { SampleCustomer } from '@/configurations/lib/email/personalization';

interface EmailPreviewProps {
  html: string;
  subject?: string;
  sender?: string;
  selectedCustomer: SampleCustomer;
  onCustomerChange: (customer: SampleCustomer) => void;
}

export function EmailPreview({ html, subject, sender, selectedCustomer, onCustomerChange }: EmailPreviewProps) {
  const [view, setView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  const checks = performEmailChecks(html, subject, sender);

  return (
    <div className="h-full flex flex-col bg-muted/10 rounded-md overflow-hidden">
      <div className="flex items-center justify-between p-2 border-b bg-background flex-wrap gap-2">
        <div className="flex items-center gap-2">
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
            variant={view === 'tablet' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setView('tablet')}
            className="h-8 px-2"
          >
            <Tablet className="w-4 h-4 mr-2" />
            Tablet
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
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Preview as:</span>
          <Select 
            value={MOCK_CUSTOMERS.find(c => c.data === selectedCustomer)?.id || MOCK_CUSTOMERS[0].id}
            onValueChange={val => {
              const c = MOCK_CUSTOMERS.find(c => c.id === val);
              if (c) onCustomerChange(c.data);
            }}
          >
            <SelectTrigger className="w-[180px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MOCK_CUSTOMERS.map(c => (
                <SelectItem key={c.id} value={c.id} className="text-xs">{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4 flex justify-center bg-muted/30">
        <div 
          className="bg-white shadow-sm transition-all duration-300 ease-in-out border"
          style={{ 
            width: view === 'mobile' ? '375px' : view === 'tablet' ? '768px' : '100%', 
            maxWidth: '1000px',
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

      <div className="bg-background border-t p-4 max-h-[30%] overflow-y-auto">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Email Checks</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {checks.map(check => (
            <div key={check.id} className="flex items-start gap-2 text-sm">
              {check.severity === 'passed' && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />}
              {check.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />}
              {check.severity === 'error' && <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
              <div className="min-w-0">
                <span className={`font-medium ${check.severity === 'error' ? 'text-red-700' : check.severity === 'warning' ? 'text-yellow-700' : 'text-muted-foreground'}`}>
                  {check.label}
                </span>
                {check.message && (
                  <p className="text-xs text-muted-foreground mt-0.5">{check.message}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
