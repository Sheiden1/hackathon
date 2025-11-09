import { useState } from "react";
import { Mail, Lock, User, GraduationCap, Users, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface StudentSignupFormProps {
  onBack: () => void;
  onToggleMode: () => void;
}

export const StudentSignupForm = ({ onBack, onToggleMode }: StudentSignupFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    grade: "",
    class: "",
  });

  const { signup } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.grade || !formData.class) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }
    signup({
      ...formData,
      role: "student",
    });
  };

  return (
    <div className="w-full max-w-md animate-slide-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all hover:scale-105 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="font-medium">Voltar</span>
      </button>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Cadastro de Aluno</h1>
        <p className="text-muted-foreground font-medium">Preencha seus dados para começar a aprender</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground font-medium">
            Nome Completo
          </Label>
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent transition-all group-focus-within:scale-110" />
            <Input
              id="name"
              type="text"
              placeholder="Seu nome completo"
              className="pl-10 h-12 bg-muted/30 border-border focus:ring-2 focus:ring-accent focus:border-accent transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
        </div>

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
              placeholder="Mínimo 8 caracteres"
              className="pl-10 pr-10 h-12 bg-muted/30 border-border focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={8}
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

        <div className="space-y-2">
          <Label htmlFor="grade" className="text-foreground font-medium">
            Série
          </Label>
          <div className="relative group">
            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent transition-all group-focus-within:scale-110" />
            <Input
              id="grade"
              type="text"
              placeholder="Ex: 9º ano, 2º médio..."
              className="pl-10 h-12 bg-muted/30 border-border focus:ring-2 focus:ring-accent focus:border-accent transition-all"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="class" className="text-foreground font-medium">
            Turma
          </Label>
          <div className="relative group">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary transition-all group-focus-within:scale-110" />
            <Input
              id="class"
              type="text"
              placeholder="Ex: Turma A, B..."
              className="pl-10 h-12 bg-muted/30 border-border focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-gradient-secondary hover:shadow-hover text-white font-semibold shadow-medium hover:scale-[1.02] transition-all duration-300"
        >
          Criar Conta
        </Button>

        <div className="text-center pt-4">
          <p className="text-muted-foreground font-medium">
            Já tem uma conta?{" "}
            <button
              type="button"
              onClick={onToggleMode}
              className="text-secondary hover:text-secondary-hover font-semibold transition-all hover:scale-105 inline-block"
            >
              Entrar
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};
