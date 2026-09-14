import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Mail,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { getCurrentRole } from "@/admin/lib/authService";
import type { UserRole } from "@/admin/lib/authService";

type NavItem = {
  label: string;
  href: string;
  requiredRole?: UserRole;
};

type NavGroup = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRole?: UserRole;
  href?: string;
  items?: NavItem[];
};

const navGroups: NavGroup[] = [
  { 
    label: "Dashboard", 
    href: "/admin", 
    icon: LayoutDashboard 
  },
  { 
    label: "Products", 
    icon: Package, 
    items: [
      { label: "Products", href: "/admin/products" },
      { label: "Imports", href: "/admin/imports" },
    ]
  },
  { 
    label: "Email Marketing", 
    icon: Mail, 
    items: [
      { label: "Campaigns", href: "/admin/campaigns" },
      { label: "Audience", href: "/admin/audience" },
    ]
  },
  { 
    label: "Users", 
    href: "/admin/users", 
    icon: Users, 
    requiredRole: "super_admin" 
  },
];

type AdminSidebarProps = {
  onNavigate?: () => void;
  isCollapsed?: boolean;
  toggleCollapsed?: () => void;
};

export function AdminSidebar({ onNavigate, isCollapsed, toggleCollapsed }: AdminSidebarProps) {
  const currentRole = getCurrentRole();
  const location = useLocation();
  
  // Track expanded groups
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Auto-expand based on current location
  useEffect(() => {
    if (isCollapsed) return; // Don't auto-expand if sidebar is collapsed (keeps UI clean)
    
    const newExpanded = { ...expandedGroups };
    let hasChanges = false;

    navGroups.forEach(group => {
      if (group.items) {
        const isActive = group.items.some(item => location.pathname.startsWith(item.href));
        if (isActive && !newExpanded[group.label]) {
          newExpanded[group.label] = true;
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      setExpandedGroups(newExpanded);
    }
  }, [location.pathname, isCollapsed]);

  const toggleGroup = (label: string) => {
    // If we're collapsed and clicking a group, expand the whole sidebar first
    if (isCollapsed && toggleCollapsed) {
      toggleCollapsed();
      setExpandedGroups(prev => ({ ...prev, [label]: true }));
      return;
    }
    setExpandedGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const visibleGroups = navGroups.filter(
    (group) => !group.requiredRole || currentRole === group.requiredRole
  );

  return (
    <div className="flex h-full flex-col bg-card border-r border-border transition-all duration-300">
      {/* Brand */}
      <div className={`flex h-14 items-center border-b border-border transition-all duration-300 ${isCollapsed ? 'justify-center px-2' : 'px-6'}`}>
        <NavLink
          to="/admin"
          onClick={onNavigate}
          className={`font-bold tracking-tighter text-foreground transition-all duration-300 ${isCollapsed ? 'text-sm' : 'text-xl'}`}
          title="VDS Admin"
        >
          {isCollapsed ? "VDS" : "VDS Admin"}
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {visibleGroups.map((group) => {
            const isGroupActive = group.items?.some(item => location.pathname === item.href || location.pathname.startsWith(item.href + '/'));
            const isExpanded = expandedGroups[group.label];

            if (!group.items) {
              // Top-level item without children (e.g. Dashboard)
              return (
                <li key={group.label}>
                  <NavLink
                    to={group.href!}
                    end={group.href === "/admin"}
                    onClick={onNavigate}
                    title={isCollapsed ? group.label : undefined}
                    className={({ isActive }) =>
                      [
                        "flex items-center rounded-lg py-2 font-medium transition-colors",
                        isCollapsed ? "justify-center px-2" : "px-3 gap-3",
                        isActive
                          ? "bg-accent text-foreground"
                          : "text-secondary-foreground hover:bg-accent/50 hover:text-foreground",
                      ].join(" ")
                    }
                  >
                    <group.icon className={`shrink-0 ${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'}`} />
                    {!isCollapsed && <span className="text-sm">{group.label}</span>}
                  </NavLink>
                </li>
              );
            }

            // Group with children
            return (
              <li key={group.label} className="space-y-1">
                <button
                  onClick={() => toggleGroup(group.label)}
                  title={isCollapsed ? group.label : undefined}
                  className={[
                    "w-full flex items-center rounded-lg py-2 font-medium transition-colors outline-none",
                    isCollapsed ? "justify-center px-2" : "px-3 gap-3",
                    isGroupActive && isCollapsed
                      ? "bg-accent text-foreground"
                      : isGroupActive
                      ? "text-foreground"
                      : "text-secondary-foreground hover:bg-accent/50 hover:text-foreground"
                  ].join(" ")}
                >
                  <group.icon className={`shrink-0 ${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} ${isGroupActive && !isCollapsed ? 'text-primary' : ''}`} />
                  {!isCollapsed && (
                    <>
                      <span className="text-sm flex-1 text-left">{group.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                    </>
                  )}
                </button>

                {/* Children items */}
                {!isCollapsed && isExpanded && (
                  <ul className="pl-9 pr-2 space-y-1 pb-2">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <NavLink
                          to={item.href}
                          onClick={onNavigate}
                          className={({ isActive }) =>
                            [
                              "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                              isActive
                                ? "bg-accent text-foreground"
                                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                            ].join(" ")
                          }
                        >
                          {item.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle (Desktop Only) */}
      {toggleCollapsed && (
        <div className="px-3 py-2">
          <button
            onClick={toggleCollapsed}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!isCollapsed}
            className={`w-full flex items-center rounded-lg py-2 text-secondary-foreground hover:bg-accent/50 hover:text-foreground transition-colors ${isCollapsed ? 'justify-center px-2' : 'px-3 gap-3'}`}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-4 h-4" />}
            {!isCollapsed && <span className="text-sm font-medium">Collapse</span>}
          </button>
        </div>
      )}

      {/* Footer */}
      <div className={`border-t border-border py-3 transition-all duration-300 ${isCollapsed ? 'px-2 text-center' : 'px-4'}`}>
        <p className="text-[11px] text-muted-foreground truncate" title={`Role: ${currentRole}`}>
          {isCollapsed ? currentRole.substring(0, 1).toUpperCase() : `Role: ${currentRole}`}
        </p>
      </div>
    </div>
  );
}
