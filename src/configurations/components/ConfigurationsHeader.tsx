import { Menu, User as UserIcon } from "lucide-react";
import { Button } from "@/configurations/components/ui/button";
import { handleLogout, getCurrentRole } from "@/configurations/lib/authService";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/configurations/components/ui/dropdown-menu";
import { getRoles } from "@/configurations/lib/permissions/store";
import { mapAuthRoleToPermissionRoleId } from "@/configurations/lib/permissions/engine";

type ConfigurationsHeaderProps = {
  onMenuClick?: () => void;
};

export function ConfigurationsHeader({ onMenuClick }: ConfigurationsHeaderProps) {
  const navigate = useNavigate();
  
  // Resolve current user mock identity & human readable role
  const currentAuthRole = getCurrentRole();
  const activeRoleId = mapAuthRoleToPermissionRoleId(currentAuthRole);
  const roles = getRoles();
  const activeRole = roles.find(r => r.id === activeRoleId);
  const humanReadableRole = activeRole ? activeRole.name : 'Unknown';

  // We map the mock user purely for display since no real backend exists
  const mockEmail = currentAuthRole === 'super_admin' ? 'superadmin@vapedealspot.com' 
                    : currentAuthRole === 'admin' ? 'admin@vapedealspot.com' 
                    : 'user@vapedealspot.com';
  
  const mockName = currentAuthRole === 'super_admin' ? 'Super Admin'
                   : currentAuthRole === 'admin' ? 'Admin User'
                   : 'VDS User';

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="text-lg font-semibold tracking-tight text-foreground lg:hidden">
          Configurations
        </span>
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 rounded-md border bg-card p-1.5 pr-3 text-left transition-colors hover:bg-accent hover:text-accent-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-muted/50 text-foreground">
              <UserIcon className="h-4 w-4" />
            </div>
            <div className="hidden flex-col sm:flex gap-0.5">
              <span className="text-sm font-semibold leading-none">{mockName}</span>
              <span className="text-xs text-muted-foreground">{mockEmail}</span>
              <span className="text-[10px] font-medium text-muted-foreground/80">{humanReadableRole}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={async () => {
                await handleLogout();
                navigate('/login');
              }}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
