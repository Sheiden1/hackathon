import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBackendApi } from "@/hooks/useBackendApi";
import { useNavigate } from "react-router-dom";

interface ApiQuestion {
  id: string;
  available: boolean;
  subject_id: string | null;
  created_by: string | null;
  source_material_id: string | null;
  difficulty: string;
  question: {
    statement: string;
    alternatives: Array<{
      text: string;
      letter: string;
    }>;
    correct_answer: string | null;
  };
}

interface ApiResponse {
  items: ApiQuestion[];
  total?: number;
  limit?: number;
  offset?: number;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  subject: string;
}

const transformApiQuestion = (apiQuestion: ApiQuestion, materia: string): Question => {
  // Encontrar o índice da resposta correta
  const correctAnswerIndex = apiQuestion.question.alternatives.findIndex(
    (alt) => alt.letter === apiQuestion.question.correct_answer,
  );

  return {
    id: apiQuestion.id,
    question: apiQuestion.question.statement,
    options: apiQuestion.question.alternatives.map((alt) => alt.text),
    correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0,
    subject: materia,
  };
};

const StudentCustomActivity = ({ onBack }: { onBack: () => void }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { get, loading } = useBackendApi();
  const [subject, setSubject] = useState("");
  const [questionCount, setQuestionCount] = useState(3);

  const subjectMap: Record<string, string> = {
    matematica: "Matemática",
    portugues: "Português",
    ciencias: "Ciências",
    historia: "História",
    geografia: "Geografia",
    ingles: "Inglês",
  };

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

    try {
      const mappedSubject = subjectMap[subject] || subject;
      console.log("Buscando questões:", { subject: mappedSubject, questionCount });
      const response = await get<ApiResponse>(`/questions?materia=${mappedSubject}&limit=${questionCount}`);
      console.log("Resposta da API:", response);

      if (!response) {
        toast({
          title: "Erro",
          description: "Não foi possível conectar ao servidor. Verifique sua conexão.",
          variant: "destructive",
        });
        return;
      }

      // Verificar se a resposta tem o formato esperado
      const apiQuestions = response.items || [];

      if (apiQuestions.length === 0) {
        toast({
          title: "Nenhuma questão encontrada",
          description: "Não há questões disponíveis para esta matéria.",
          variant: "destructive",
        });
        return;
      }

      // Transformar as questões da API para o formato esperado pelo componente
      const transformedQuestions = apiQuestions.map((q) => transformApiQuestion(q, subjectMap[subject] || subject));
      console.log("Questões transformadas:", transformedQuestions);

      toast({
        title: "Atividade Criada",
        description: `Atividade com ${transformedQuestions.length} questões criada com sucesso!`,
      });

      navigate("/student/do-activity", { state: { questions: transformedQuestions } });
    } catch (error) {
      console.error("Erro ao criar atividade:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar a atividade. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      <div className="container mx-auto px-4 py-8">
        <Button onClick={onBack} variant="outline" className="mb-6 hover:scale-105 transition-all">
          Voltar ao Dashboard
        </Button>

        <Card className="p-8 shadow-hover border-border/50">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Criar Atividade Personalizada</h1>
          <p className="text-muted-foreground mb-8">Escolha a matéria e quantidade de questões para sua atividade</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject">Matéria</Label>
              <Select value={subject} onValueChange={setSubject} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a matéria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Matemática">Matemática</SelectItem>
                  <SelectItem value="portugues">Português</SelectItem>
                  <SelectItem value="ciencias">Ciências</SelectItem>
                  <SelectItem value="historia">História</SelectItem>
                  <SelectItem value="Geografia">Geografia</SelectItem>
                  <SelectItem value="ingles">Inglês</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="questionCount">Quantidade de Questões</Label>
                <span className="text-2xl font-bold text-primary">{questionCount}</span>
              </div>
              <Slider
                id="questionCount"
                min={1}
                max={5}
                step={1}
                value={[questionCount]}
                onValueChange={(value) => setQuestionCount(value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
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
