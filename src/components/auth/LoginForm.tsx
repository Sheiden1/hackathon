import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onToggleMode: () => void;
}

export const LoginForm = ({ onToggleMode }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(formData.email, formData.password);
    if (!success) {
      toast({
        title: "Erro ao fazer login",
        description: "Email ou senha incorretos.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-md animate-scale-up">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Bem-vindo de volta!</h1>
        <p className="text-muted-foreground font-medium">Entre para continuar sua jornada de aprendizado</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground font-medium">
            E-mail
          </Label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary transition-all group-focus-within:scale-110" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="pl-10 h-12 bg-muted/30 border-border focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground font-medium">
            Senha
          </Label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary transition-all group-focus-within:scale-110" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10 pr-10 h-12 bg-muted/30 border-border focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-secondary transition-all hover:scale-110"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="button"
            className="text-sm text-primary hover:text-primary-hover font-medium transition-colors"
          >
            Esqueci minha senha
          </button>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-gradient-primary hover:shadow-hover text-white font-semibold shadow-medium hover:scale-[1.02] transition-all duration-300"
        >
          Entrar
        </Button>

        <div className="text-center pt-4">
          <p className="text-muted-foreground font-medium">
            Ainda não tem uma conta?{" "}
            <button
              type="button"
              onClick={onToggleMode}
              className="text-primary hover:text-primary-hover font-semibold transition-all hover:scale-105 inline-block"
            >
              Cadastre-se
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};
