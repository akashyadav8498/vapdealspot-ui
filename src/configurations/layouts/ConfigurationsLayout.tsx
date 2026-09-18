import '../configurations.css';
import { useState } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { ConfigurationsSidebar } from "@/configurations/components/ConfigurationsSidebar";
import { ConfigurationsHeader } from "@/configurations/components/ConfigurationsHeader";
import { getCurrentRole } from "@/configurations/lib/authService";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/configurations/components/ui/sheet";
import { can } from "@/configurations/lib/permissions/engine";
import { ShieldAlert } from "lucide-react";

// Removed getPageTitle as it's no longer used in the header

function RouteGuard({ pathname, children }: { pathname: string, children: React.ReactNode }) {
  let isAllowed = true;

  if (pathname.startsWith('/admin/products')) {
    isAllowed = can('Products', 'Products', 'View');
  } else if (pathname.startsWith('/admin/imports')) {
    isAllowed = can('Products', 'Imports', 'View');
  } else if (pathname.startsWith('/admin/campaigns')) {
    isAllowed = can('Email Marketing', 'Campaigns', 'View');
  } else if (pathname.startsWith('/admin/audience')) {
    isAllowed = can('Email Marketing', 'Audience', 'View');
  } else if (pathname.startsWith('/admin/users')) {
    isAllowed = can('Users & Permissions', 'Users', 'View');
  } else if (pathname.startsWith('/admin/roles')) {
    isAllowed = can('Users & Permissions', 'Roles & Permissions', 'View');
  }

  if (!isAllowed) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center border rounded-lg bg-muted/10 p-8">
        <ShieldAlert className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2 text-foreground">Access Denied</h2>
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
      </div>
    );
  }

  return <>{children}</>;
}

export function ConfigurationsLayout() {
  const currentRole = getCurrentRole();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // RBAC Enforcement
  if (currentRole === "user") {
    return <Navigate to="/login" replace />;
  }

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('admin-sidebar-collapsed') === 'true';
  });

  const toggleCollapsed = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('admin-sidebar-collapsed', String(next));
      return next;
    });
  };

  const sidebarWidthClass = isCollapsed ? "lg:w-20" : "lg:w-60";
  const fixedWidthClass = isCollapsed ? "w-20" : "w-60";

  return (
    <div className="configurations-root min-h-screen flex bg-background font-sans text-foreground">
      {/* Desktop sidebar — persistent */}
      <aside className={`hidden lg:flex lg:shrink-0 transition-all duration-300 ease-in-out ${sidebarWidthClass}`}>
        <div className={`fixed inset-y-0 left-0 transition-all duration-300 ease-in-out ${fixedWidthClass}`}>
          <ConfigurationsSidebar isCollapsed={isCollapsed} toggleCollapsed={toggleCollapsed} />
        </div>
      </aside>

      {/* Mobile sidebar — Sheet drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" showCloseButton={true} className="configurations-root w-60 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <ConfigurationsSidebar onNavigate={() => setMobileOpen(false)} isCollapsed={false} />
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div className="flex flex-1 flex-col min-w-0">
        <ConfigurationsHeader
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-4 lg:p-6">
          <RouteGuard pathname={location.pathname}>
            <Outlet />
          </RouteGuard>
        </main>
      </div>
    </div>
  );
}
