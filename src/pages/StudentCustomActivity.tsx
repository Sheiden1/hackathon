import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBackendApi } from "@/hooks/useBackendApi";
import { useNavigate } from "react-router-dom";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  subject: string;
}

const StudentCustomActivity = ({ onBack }: { onBack: () => void }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { get, loading } = useBackendApi();
  const [subject, setSubject] = useState("");
  const [questionCount, setQuestionCount] = useState("5");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject || !questionCount) {
      toast({
        title: "Erro",
        description: "Por favor, selecione a matéria e quantidade de questões.",
        variant: "destructive",
      });
      return;
    }

    const questions = await get<Question[]>(`/questions?subject=${subject}&limit=${questionCount}`);
    
    if (!questions || questions.length === 0) {
      toast({
        title: "Erro",
        description: "Não foi possível buscar as questões. Tente novamente.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Atividade Criada",
      description: `Atividade com ${questions.length} questões criada com sucesso!`,
    });

    navigate("/student/do-activity", { state: { questions } });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={onBack}
          variant="outline"
          className="mb-6 hover:scale-105 transition-all"
        >
          Voltar ao Dashboard
        </Button>

        <Card className="p-8 shadow-hover border-border/50">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Criar Atividade Personalizada
          </h1>
          <p className="text-muted-foreground mb-8">
            Escolha a matéria e quantidade de questões para sua atividade
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject">Matéria</Label>
              <Select value={subject} onValueChange={setSubject} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a matéria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matematica">Matemática</SelectItem>
                  <SelectItem value="portugues">Português</SelectItem>
                  <SelectItem value="ciencias">Ciências</SelectItem>
                  <SelectItem value="historia">História</SelectItem>
                  <SelectItem value="geografia">Geografia</SelectItem>
                  <SelectItem value="ingles">Inglês</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionCount">Quantidade de Questões</Label>
              <Select value={questionCount} onValueChange={setQuestionCount} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a quantidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 questões</SelectItem>
                  <SelectItem value="10">10 questões</SelectItem>
                  <SelectItem value="15">15 questões</SelectItem>
                  <SelectItem value="20">20 questões</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Carregando Questões...
                </>
              ) : (
                "Criar Atividade"
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default StudentCustomActivity;
