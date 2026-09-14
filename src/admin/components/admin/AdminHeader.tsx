import { Menu, LogOut } from "lucide-react";
import { Button } from "@/admin/components/ui/button";
import { getCurrentRole, handleLogout } from "@/admin/lib/authService";
import { useNavigate } from "react-router-dom";

type AdminHeaderProps = {
  pageTitle: string;
  onMenuClick?: () => void;
};

export function AdminHeader({ pageTitle, onMenuClick }: AdminHeaderProps) {
  const navigate = useNavigate();

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

        <h1 className="text-base font-semibold text-foreground tracking-tight">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="text-secondary-foreground hover:text-foreground"
          onClick={async () => {
            await handleLogout();
            navigate('/login');
          }}
        >
          <LogOut className="h-4 w-4 mr-1.5" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
