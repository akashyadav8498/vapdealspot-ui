import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Campaign } from '@/admin/lib/email/types';
import { initialCampaigns } from '@/admin/lib/email/campaignState';
import { initialContacts } from '@/admin/lib/email/audienceState';
import { getValidRecipients } from '@/admin/lib/email/useAudience';
import { Button } from '@/admin/components/ui/button';
import { EmailPreview } from '@/admin/components/admin/email/EmailPreview';
import { ArrowLeft, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import { sendCampaign, injectComplianceFooter } from '@/admin/lib/email/api';

export function CampaignReviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success?: boolean; message?: string }>({});

  useEffect(() => {
    const existing = initialCampaigns.find(c => c.id === id);
    if (existing) {
      setCampaign(existing as Campaign);
    } else {
      navigate('/admin/campaigns');
    }
  }, [id, navigate]);

  if (!campaign) return null;

  // Validation Checks
  const activeContacts = getValidRecipients(campaign.audience, initialContacts);

  const hasName = campaign.name && campaign.name.trim().length > 0;
  const hasSubject = campaign.subject && campaign.subject.trim().length > 0;
  const hasSenderName = campaign.senderName && campaign.senderName.trim().length > 0;
  const hasSenderEmail = campaign.senderEmail && campaign.senderEmail.includes('@');
  const hasContent = campaign.contentHtml && campaign.contentHtml.length > 20;
  const hasAudience = activeContacts.length > 0;

  const isReady = hasName && hasSubject && hasSenderName && hasSenderEmail && hasContent && hasAudience;

  const handleSendCampaign = async () => {
    if (!isReady) return;
    
    setIsSending(true);
    setSendResult({});
    
    try {
      const finalHtml = injectComplianceFooter(campaign.contentHtml);
      await sendCampaign({
        campaignId: campaign.id,
        subject: campaign.subject,
        html: finalHtml,
        senderName: campaign.senderName,
        senderEmail: campaign.senderEmail,
        recipientEmails: activeContacts.map(c => c.email)
      });
      setSendResult({ success: true, message: 'Campaign sent successfully!' });
      
      // Update local state to reflect sent
      setCampaign({ ...campaign, status: 'sent', sentAt: new Date().toISOString(), recipientCount: activeContacts.length });
    } catch (err: any) {
      setSendResult({ success: false, message: err.message || 'Failed to send campaign.' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/campaigns/${id}/edit`)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold text-foreground tracking-tight">Review & Send</h2>
          <p className="text-sm text-secondary-foreground">Final validation before dispatching to your audience.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6 space-y-6">
            <h3 className="font-medium">Compliance & Validation Checklist</h3>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                {hasName ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />}
                <div>
                  <p className="text-sm font-medium">Campaign Name</p>
                  <p className="text-xs text-muted-foreground">{hasName ? campaign.name : 'Missing internal campaign name'}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                {hasSubject ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />}
                <div>
                  <p className="text-sm font-medium">Subject Line</p>
                  <p className="text-xs text-muted-foreground">{hasSubject ? campaign.subject : 'Missing subject line'}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                {hasSenderName && hasSenderEmail ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />}
                <div>
                  <p className="text-sm font-medium">Sender Identity</p>
                  <p className="text-xs text-muted-foreground">{hasSenderName && hasSenderEmail ? `${campaign.senderName} <${campaign.senderEmail}>` : 'Missing or invalid sender details'}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                {hasContent ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />}
                <div>
                  <p className="text-sm font-medium">Email Content</p>
                  <p className="text-xs text-muted-foreground">{hasContent ? 'Content exists' : 'Email body is empty'}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                {hasAudience ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />}
                <div>
                  <p className="text-sm font-medium">Audience</p>
                  <p className="text-xs text-muted-foreground">{hasAudience ? `Targeting ${activeContacts.length} subscribed contacts` : 'No subscribed contacts found'}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Compliance Footer</p>
                  <p className="text-xs text-muted-foreground">Will be automatically injected upon sending (Business Address + Unsubscribe Link)</p>
                </div>
              </li>
            </ul>

            {sendResult.message && (
              <div className={`p-4 rounded-md text-sm ${sendResult.success ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'}`}>
                <div className="flex items-start gap-2">
                  <p className="font-medium whitespace-pre-wrap">{sendResult.message}</p>
                </div>
              </div>
            )}

            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleSendCampaign} 
              disabled={!isReady || isSending || campaign.status === 'sent'}
            >
              <Send className="w-4 h-4 mr-2" />
              {isSending ? 'Dispatching Campaign...' : campaign.status === 'sent' ? 'Campaign Sent' : 'Send Now'}
            </Button>
          </div>
        </div>

        <div className="h-[600px] border rounded-lg overflow-hidden bg-muted/20">
          <EmailPreview html={injectComplianceFooter(campaign.contentHtml)} />
        </div>
      </div>
    </div>
  );
}
