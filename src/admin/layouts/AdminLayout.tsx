import '../admin.css';
import { useState } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { AdminSidebar } from "@/admin/components/admin/AdminSidebar";
import { AdminHeader } from "@/admin/components/admin/AdminHeader";
import { getCurrentRole } from "@/admin/lib/authService";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/admin/components/ui/sheet";

/**
 * Derives the page title from the current pathname.
 */
function getPageTitle(pathname: string): string {
  const segment = pathname.replace("/admin", "").replace("/", "");
  if (!segment) return "Dashboard";
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

export function AdminLayout() {
  const currentRole = getCurrentRole();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

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
    <div className="admin-root min-h-screen flex bg-background font-sans text-foreground">
      {/* Desktop sidebar — persistent */}
      <aside className={`hidden lg:flex lg:shrink-0 transition-all duration-300 ease-in-out ${sidebarWidthClass}`}>
        <div className={`fixed inset-y-0 left-0 transition-all duration-300 ease-in-out ${fixedWidthClass}`}>
          <AdminSidebar isCollapsed={isCollapsed} toggleCollapsed={toggleCollapsed} />
        </div>
      </aside>

      {/* Mobile sidebar — Sheet drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" showCloseButton={true} className="w-60 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <AdminSidebar onNavigate={() => setMobileOpen(false)} isCollapsed={false} />
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader
          pageTitle={pageTitle}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
