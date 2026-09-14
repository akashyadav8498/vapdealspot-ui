import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/admin/components/ui/button';

export function AdminDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground tracking-tight">
          Dashboard
        </h2>
        <p className="text-sm text-secondary-foreground">
          Welcome to the Vape Deal Spot admin panel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col hover:border-primary/50 transition-colors shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Email Marketing</h3>
          <p className="text-sm text-muted-foreground flex-1 mb-6">
            Create campaigns, manage your audience, and send email updates to your customers.
          </p>
          <Button 
            className="w-full justify-between" 
            variant="outline"
            onClick={() => navigate('/admin/campaigns')}
          >
            Manage Campaigns
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
