import { useState } from "react";
import { BookOpen } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";

type AuthMode = "login" | "signup";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-6xl animate-fade-in">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-3 mb-4 animate-bounce-subtle">
            <div className="p-4 rounded-2xl bg-gradient-primary shadow-card">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-display font-bold bg-gradient-primary bg-clip-text text-transparent">
              EduPlatform
            </h1>
          </div>
          <p className="text-muted-foreground text-lg font-medium">Transformando educação através da tecnologia</p>
        </div>

        <div className="bg-card rounded-3xl shadow-card hover:shadow-hover transition-all duration-300 p-8 md:p-12 flex justify-center border border-border/50">
          {mode === "login" ? <LoginForm onToggleMode={toggleMode} /> : <SignupForm onToggleMode={toggleMode} />}
        </div>

        <footer className="text-center mt-8 text-sm text-muted-foreground">
          <p>© 2025 EduPlatform. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default Auth;
