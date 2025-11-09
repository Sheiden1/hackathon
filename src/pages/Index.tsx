import { Link } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center max-w-3xl px-4">
        <div className="inline-flex items-center justify-center gap-3 mb-8">
          <div className="p-4 rounded-2xl bg-primary/10">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            FaltaUmNome
          </h1>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Bem-vindo à plataforma que transforma educação
        </h2>

        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Conectamos professores e alunos em uma experiência de aprendizado moderna, intuitiva e inspiradora. Comece sua
          jornada educacional agora!
        </p>

        <Link to="/auth">
          <Button className="h-14 px-8 text-lg bg-gradient-primary hover:bg-gradient-hover text-white font-semibold shadow-soft hover:shadow-medium transition-all duration-300 group">
            Começar Agora
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
