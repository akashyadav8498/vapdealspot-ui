import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/admin/components/ui/input";
import { Button } from "@/admin/components/ui/button";
import { handleLogin, getPostLoginRedirect } from "@/admin/lib/authService";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setGlobalError(null);
    try {
      const role = await handleLogin(data.email, data.password);
      // On success, redirect based on returned user role
      navigate(getPostLoginRedirect(role));
    } catch (err: any) {
      setGlobalError(err.message || "Authentication failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {globalError && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
          {globalError}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          {...register("email")}
          aria-invalid={!!errors.email}
          className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {errors.email && (
          <p className="text-[13px] text-destructive font-medium">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Password
          </label>
          <a href="#" className="text-[13px] text-secondary-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline">
            Forgot password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          {...register("password")}
          aria-invalid={!!errors.password}
          className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {errors.password && (
          <p className="text-[13px] text-destructive font-medium">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign in
      </Button>
    </form>
  );
}
