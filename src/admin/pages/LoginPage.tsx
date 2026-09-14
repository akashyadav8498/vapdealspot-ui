import { Link } from "react-router-dom";
import { LoginForm } from "../components/auth/LoginForm";
import "../admin.css";

export function LoginPage() {
  return (
    <div className="admin-root min-h-screen flex flex-col justify-center items-center bg-background p-4 sm:p-8 font-sans">
      <div className="w-full max-w-sm flex flex-col gap-6">
        
        {/* Brand / Logo */}
        <div className="flex justify-center">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-foreground hover:opacity-90 transition-opacity">
            Vape Deal Spot Admin
          </Link>
        </div>

        {/* Auth Card */}
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm text-left">
          <div className="flex flex-col space-y-1.5 mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="text-sm text-secondary-foreground">
              Sign in to continue to the Admin Dashboard.
            </p>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
