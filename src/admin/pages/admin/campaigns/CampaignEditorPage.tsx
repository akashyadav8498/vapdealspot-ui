import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Campaign } from '@/admin/lib/email/types';
import { initialCampaigns, starterTemplates } from '@/admin/lib/email/campaignState';
import { initialContacts } from '@/admin/lib/email/audienceState';
import { getValidRecipients } from '@/admin/lib/email/useAudience';
import { DEFAULT_SENDER_NAME, DEFAULT_SENDER_EMAIL } from '@/admin/lib/email/constants';
import { Button } from '@/admin/components/ui/button';
import { Input } from '@/admin/components/ui/input';
import { EmailEditor } from '@/admin/components/admin/email/EmailEditor';
import { EmailPreview } from '@/admin/components/admin/email/EmailPreview';
import { ArrowLeft, Save, Play, CheckCircle2 } from 'lucide-react';
import { sendTestEmail, injectComplianceFooter } from '@/admin/lib/email/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/admin/components/ui/alert-dialog';

export function CampaignEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id;

  const [campaign, setCampaign] = useState<Partial<Campaign>>({
    name: '',
    subject: '',
    senderName: DEFAULT_SENDER_NAME,
    senderEmail: DEFAULT_SENDER_EMAIL,
    contentHtml: starterTemplates.blank,
    audience: { type: 'all' },
    status: 'draft',
  });

  const [testEmail, setTestEmail] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string }>({});

  const [templateConfirmOpen, setTemplateConfirmOpen] = useState(false);
  const [pendingTemplateKey, setPendingTemplateKey] = useState<string | null>(null);

  useEffect(() => {
    if (!isNew) {
      const existing = initialCampaigns.find(c => c.id === id);
      if (existing) {
        setCampaign(existing);
      } else {
        navigate('/admin/campaigns');
      }
    }
  }, [id, isNew, navigate]);

  const handleSaveDraft = () => {
    alert('Draft saved successfully!');
    if (isNew) {
      navigate('/admin/campaigns');
    }
  };

  const handleSendTest = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    
    setIsSendingTest(true);
    setTestResult({});
    
    try {
      const finalHtml = injectComplianceFooter(campaign.contentHtml || '');
      await sendTestEmail({
        toEmail: testEmail,
        subject: campaign.subject || 'No Subject',
        html: finalHtml,
        senderName: campaign.senderName || '',
        senderEmail: campaign.senderEmail || '',
      });
      setTestResult({ success: true, message: 'Test email sent successfully!' });
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || 'Failed to send test email.' });
    } finally {
      setIsSendingTest(false);
    }
  };

  const confirmTemplateChange = () => {
    if (pendingTemplateKey) {
      const templateHtml = starterTemplates[pendingTemplateKey as keyof typeof starterTemplates];
      if (templateHtml) {
        setCampaign(prev => ({ ...prev, contentHtml: templateHtml }));
      }
    }
    setTemplateConfirmOpen(false);
    setPendingTemplateKey(null);
  };

  const toggleContactSelection = (contactId: string) => {
    const currentAudience = campaign.audience || { type: 'all' };
    if (currentAudience.type === 'all') return;

    const specificAudience = currentAudience as { type: 'specific'; contactIds: string[] };
    const currentIds = specificAudience.contactIds || [];
    const newIds = currentIds.includes(contactId)
      ? currentIds.filter(id => id !== contactId)
      : [...currentIds, contactId];

    setCampaign({ ...campaign, audience: { type: 'specific', contactIds: newIds } });
  };

  const isReadonly = campaign.status === 'sent';
  
  // Calculate selected count
  const validRecipients = getValidRecipients(campaign.audience, initialContacts);
  const selectedCount = validRecipients.length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/campaigns')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold text-foreground tracking-tight">
              {isNew ? 'Create Campaign' : isReadonly ? 'View Campaign' : 'Edit Campaign'}
            </h2>
            <p className="text-sm text-secondary-foreground">
              {campaign.status === 'sent' ? 'This campaign has been sent and cannot be edited.' : 'Draft your email content and metadata.'}
            </p>
          </div>
        </div>
        {!isReadonly && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={() => navigate(`/admin/campaigns/${id || 'new'}/review`)}>
              Review & Send
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-card border rounded-lg p-6 space-y-4">
            <h3 className="font-medium">Campaign Settings</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Internal Name</label>
                <Input 
                  value={campaign.name || ''} 
                  onChange={e => setCampaign({ ...campaign, name: e.target.value })} 
                  placeholder="e.g. Summer Sale Announcement"
                  disabled={isReadonly}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Subject Line</label>
                <Input 
                  value={campaign.subject || ''} 
                  onChange={e => setCampaign({ ...campaign, subject: e.target.value })} 
                  placeholder="Your subject here..."
                  disabled={isReadonly}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Sender Name</label>
                <Input 
                  value={campaign.senderName || ''} 
                  onChange={e => setCampaign({ ...campaign, senderName: e.target.value })} 
                  disabled={isReadonly}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Sender Email</label>
                <Input 
                  value={campaign.senderEmail || ''} 
                  onChange={e => setCampaign({ ...campaign, senderEmail: e.target.value })} 
                  type="email"
                  disabled={isReadonly}
                />
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Audience</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Selected recipients: <span className="font-semibold text-foreground">{selectedCount}</span></p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input 
                    type="radio" 
                    name="audienceType"
                    checked={campaign.audience?.type === 'all'}
                    onChange={() => setCampaign({ ...campaign, audience: { type: 'all' } })}
                    disabled={isReadonly}
                    className="accent-primary"
                  />
                  All Subscribers
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input 
                    type="radio" 
                    name="audienceType"
                    checked={campaign.audience?.type === 'specific'}
                    onChange={() => setCampaign({ ...campaign, audience: { type: 'specific', contactIds: campaign.audience?.type === 'specific' ? (campaign.audience as { type: 'specific'; contactIds: string[] }).contactIds : [] } })}
                    disabled={isReadonly}
                    className="accent-primary"
                  />
                  Selected Contacts
                </label>
              </div>

              {campaign.audience?.type === 'specific' && (
                <div className="border rounded-md max-h-[200px] overflow-y-auto divide-y">
                  {initialContacts.map(contact => {
                    const isSelected = campaign.audience?.type === 'specific' && ((campaign.audience as { type: 'specific'; contactIds: string[] }).contactIds || []).includes(contact.id);
                    return (
                      <label 
                        key={contact.id} 
                        className={`flex items-center gap-3 p-3 text-sm transition-colors ${!contact.isSubscribed ? 'opacity-50 cursor-not-allowed bg-muted/30' : 'cursor-pointer hover:bg-muted/50'}`}
                      >
                        <input 
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleContactSelection(contact.id)}
                          disabled={isReadonly || !contact.isSubscribed}
                          className="accent-primary"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground truncate">{contact.email}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {[contact.firstName, contact.lastName].filter(Boolean).join(' ') || 'No name'}
                          </p>
                        </div>
                        {!contact.isSubscribed && (
                          <span className="text-xs text-destructive bg-destructive/10 px-2 py-1 rounded-full whitespace-nowrap">Unsubscribed</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6 space-y-4 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-medium">Email Content</h3>
              {!isReadonly && (
                <select 
                  className="text-sm border rounded p-1.5 min-w-[180px] bg-background"
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      setPendingTemplateKey(e.target.value);
                      setTemplateConfirmOpen(true);
                    }
                  }}
                >
                  <option value="" disabled>Load Starter Template...</option>
                  <option value="blank">Blank Template</option>
                  <option value="welcome">Welcome Series</option>
                  <option value="promotional">Promotional Sale</option>
                  <option value="newsletter">Weekly Newsletter</option>
                  <option value="product">Product Announcement</option>
                </select>
              )}
            </div>
            
            <div className="flex-1 w-full min-w-0">
              <EmailEditor 
                value={campaign.contentHtml || ''} 
                onChange={(html) => setCampaign({ ...campaign, contentHtml: html })}
                disabled={isReadonly}
              />
            </div>
          </div>
        </div>

        <div className="xl:col-span-1 space-y-6">
          <div className="bg-card border rounded-lg p-6 space-y-4">
            <h3 className="font-medium">Live Preview</h3>
            <div className="h-[500px]">
              <EmailPreview html={injectComplianceFooter(campaign.contentHtml || '')} />
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6 space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Play className="w-4 h-4" /> Send Test Email
            </h3>
            <p className="text-sm text-secondary-foreground">
              Send a real test email to verify formatting before dispatching to your audience.
            </p>
            <div className="flex gap-2">
              <Input 
                value={testEmail} 
                onChange={e => setTestEmail(e.target.value)} 
                placeholder="test@example.com"
                type="email"
              />
              <Button onClick={handleSendTest} disabled={isSendingTest}>
                {isSendingTest ? 'Sending...' : 'Test'}
              </Button>
            </div>
            
            {testResult.message && (
              <div className={`p-3 rounded-md text-sm ${testResult.success ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'}`}>
                <div className="flex items-start gap-2">
                  {testResult.success && <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />}
                  <p>{testResult.message}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={templateConfirmOpen} onOpenChange={setTemplateConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace Email Content?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to load a new template? This will completely overwrite your current email content and any unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingTemplateKey(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmTemplateChange}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
