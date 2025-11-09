import { useState, useEffect } from "react";
import { Mail, Lock, User, Building2, BookOpen, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface TeacherSignupFormProps {
  onBack: () => void;
  onToggleMode: () => void;
}

export const TeacherSignupForm = ({ onBack, onToggleMode }: TeacherSignupFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [subjects, setSubjects] = useState<Array<{ id: string; name: string }>>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    institution: "",
    subject_id: "",
  });

  const { signup } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubjects = async () => {
      const { data, error } = await supabase.from("subjects").select("id, name");
      if (error) {
        console.error("Error fetching subjects:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as disciplinas.",
          variant: "destructive",
        });
      } else {
        setSubjects(data || []);
      }
    };

    fetchSubjects();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.institution || !formData.subject_id) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 8 caracteres.",
        variant: "destructive",
      });
      return;
    }

    const selectedSubject = subjects.find(s => s.id === formData.subject_id);
    
    const { error } = await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      institution: formData.institution,
      subject: selectedSubject?.name || "",
      subject_id: formData.subject_id,
      role: "teacher",
    });

    if (error) {
      toast({
        title: "Erro ao criar conta",
        description: error,
        variant: "destructive",
      });
    }
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
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Cadastro de Professor</h1>
        <p className="text-muted-foreground font-medium">Preencha seus dados para começar a ensinar</p>
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
          <Label htmlFor="institution" className="text-foreground font-medium">
            Instituição
          </Label>
          <div className="relative group">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent transition-all group-focus-within:scale-110" />
            <Input
              id="institution"
              type="text"
              placeholder="Nome da instituição"
              className="pl-10 h-12 bg-muted/30 border-border focus:ring-2 focus:ring-accent focus:border-accent transition-all"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject" className="text-foreground font-medium">
            Disciplina
          </Label>
          <Select
            value={formData.subject_id}
            onValueChange={(value) => setFormData({ ...formData, subject_id: value })}
            required
          >
            <SelectTrigger className="h-12 bg-muted/30 border-border focus:ring-2 focus:ring-primary focus:border-primary transition-all">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <SelectValue placeholder="Selecione uma disciplina" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-gradient-primary hover:shadow-hover text-white font-semibold shadow-medium hover:scale-[1.02] transition-all duration-300"
        >
          Criar Conta
        </Button>

        <div className="text-center pt-4">
          <p className="text-muted-foreground font-medium">
            Já tem uma conta?{" "}
            <button
              type="button"
              onClick={onToggleMode}
              className="text-primary hover:text-primary-hover font-semibold transition-all hover:scale-105 inline-block"
            >
              Entrar
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};
