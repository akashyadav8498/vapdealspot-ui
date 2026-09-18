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
import { can } from "@/configurations/lib/permissions/engine";
import type { Module, Submodule } from "@/configurations/lib/permissions/types";

type NavItem = {
  label: string;
  href: string;
  module: Module;
  submodule: Submodule;
};

type NavGroup = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  items?: NavItem[];
  // If top-level with href, requires permission check
  module?: Module;
  submodule?: Submodule;
};

const navGroups: NavGroup[] = [
  { 
    label: "Dashboard", 
    href: "/admin", 
    icon: LayoutDashboard 
    // Always visible to logged in admins
  },
  { 
    label: "Products", 
    icon: Package, 
    items: [
      { label: "Products", href: "/admin/products", module: "Products", submodule: "Products" },
      { label: "Imports", href: "/admin/imports", module: "Products", submodule: "Imports" },
    ]
  },
  { 
    label: "Email Marketing", 
    icon: Mail, 
    items: [
      { label: "Campaigns", href: "/admin/campaigns", module: "Email Marketing", submodule: "Campaigns" },
      { label: "Audience", href: "/admin/audience", module: "Email Marketing", submodule: "Audience" },
    ]
  },
  { 
    label: "Users & Permissions", 
    icon: Users,
    items: [
      { label: "Users", href: "/admin/users", module: "Users & Permissions", submodule: "Users" },
      { label: "Roles & Permissions", href: "/admin/roles", module: "Users & Permissions", submodule: "Roles & Permissions" },
    ]
  },
];

type ConfigurationsSidebarProps = {
  onNavigate?: () => void;
  isCollapsed?: boolean;
  toggleCollapsed?: () => void;
};

export function ConfigurationsSidebar({ onNavigate, isCollapsed, toggleCollapsed }: ConfigurationsSidebarProps) {
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

  // Filter groups and items based on permissions
  const visibleGroups = navGroups.map(group => {
    if (group.items) {
      const filteredItems = group.items.filter(item => can(item.module, item.submodule, 'View'));
      if (filteredItems.length === 0) return null;
      return { ...group, items: filteredItems };
    } else {
      if (group.module && group.submodule) {
        if (!can(group.module, group.submodule, 'View')) return null;
      }
      return group;
    }
  }).filter(Boolean) as NavGroup[];

  return (
    <div className="flex h-full flex-col bg-card border-r border-border transition-all duration-300">
      {/* Brand */}
      <div className={`flex h-14 items-center border-b border-border transition-all duration-300 ${isCollapsed ? 'justify-center px-2' : 'px-6'}`}>
        <NavLink
          to="/admin"
          onClick={onNavigate}
          className={`font-bold tracking-tighter text-foreground transition-all duration-300 ${isCollapsed ? 'text-sm' : 'text-xl'}`}
          title="Configurations"
        >
          {isCollapsed ? "Cfg" : "Configurations"}
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
                  <ul className="space-y-1 pb-2">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <NavLink
                          to={item.href}
                          onClick={onNavigate}
                          className={({ isActive }) =>
                            [
                              "block rounded-md pl-14 pr-3 py-2 text-sm font-medium transition-colors",
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
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`w-full flex items-center rounded-lg py-2 text-secondary-foreground hover:bg-accent/50 hover:text-foreground transition-colors ${isCollapsed ? 'justify-center px-2' : 'justify-end px-3'}`}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      )}

    </div>
  );
}
