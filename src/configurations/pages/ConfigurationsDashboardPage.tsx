import { useNavigate } from 'react-router-dom';
import { Mail, Package, Users } from 'lucide-react';
import { can } from '@/configurations/lib/permissions/engine';

export function ConfigurationsDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground tracking-tight">
          Dashboard
        </h2>
        <p className="text-sm text-secondary-foreground">
          Welcome to the Vape Deal Spot configurations area.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {can('Products', 'Products', 'View') && (
          <div 
            onClick={() => navigate('/admin/products')}
            className="bg-card border border-border rounded-xl p-6 flex flex-col hover:border-primary/50 hover:shadow-md transition-all cursor-pointer shadow-sm group"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Products</h3>
            <p className="text-sm text-muted-foreground flex-1">
              Manage your product catalog, imports, and pricing.
            </p>
          </div>
        )}

        {can('Email Marketing', 'Campaigns', 'View') && (
          <div 
            onClick={() => navigate('/admin/campaigns')}
            className="bg-card border border-border rounded-xl p-6 flex flex-col hover:border-primary/50 hover:shadow-md transition-all cursor-pointer shadow-sm group"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Email Marketing</h3>
            <p className="text-sm text-muted-foreground flex-1">
              Create campaigns, manage your audience, and send email updates to your customers.
            </p>
          </div>
        )}

        {can('Users & Permissions', 'Users', 'View') && (
          <div 
            onClick={() => navigate('/admin/users')}
            className="bg-card border border-border rounded-xl p-6 flex flex-col hover:border-primary/50 hover:shadow-md transition-all cursor-pointer shadow-sm group"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Users & Permissions</h3>
            <p className="text-sm text-muted-foreground flex-1">
              Manage administrative users and configure role-based access.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
