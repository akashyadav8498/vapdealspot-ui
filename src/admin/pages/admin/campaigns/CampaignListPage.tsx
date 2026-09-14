import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Campaign } from '@/admin/lib/email/types';
import { initialCampaigns } from '@/admin/lib/email/campaignState';
import { Button } from '@/admin/components/ui/button';
import { Edit2, Plus, Send, Mail } from 'lucide-react';

export function CampaignListPage() {
  const [campaigns] = useState<Campaign[]>(initialCampaigns);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground tracking-tight">Campaigns</h2>
          <p className="text-sm text-secondary-foreground">Manage and track your email marketing campaigns.</p>
        </div>
        <Button onClick={() => navigate('/admin/campaigns/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      <div className="bg-card border rounded-lg overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-4 py-3 font-medium text-foreground">Name</th>
              <th className="px-4 py-3 font-medium text-foreground">Subject</th>
              <th className="px-4 py-3 font-medium text-foreground">Status</th>
              <th className="px-4 py-3 font-medium text-foreground">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Mail className="w-10 h-10 text-muted-foreground/50" />
                    <p>No campaigns found.</p>
                    <Button variant="outline" size="sm" onClick={() => navigate('/admin/campaigns/new')} className="mt-2">
                      Create your first campaign
                    </Button>
                  </div>
                </td>
              </tr>
            ) : (
              campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium text-foreground">{campaign.name}</td>
                  <td className="px-4 py-3 text-muted-foreground truncate max-w-[200px]">{campaign.subject}</td>
                  <td className="px-4 py-3">
                    {campaign.status === 'sent' ? (
                      <span className="inline-flex items-center text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full">
                        <Send className="w-3 h-3 mr-1" /> Sent
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-500/10 px-2 py-1 rounded-full">
                        <Edit2 className="w-3 h-3 mr-1" /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate(`/admin/campaigns/${campaign.id}/edit`)}
                    >
                      {campaign.status === 'sent' ? 'View' : 'Edit'}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
