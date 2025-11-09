import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBackendApi } from "@/hooks/useBackendApi";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  subject: string;
}

const CreateActivity = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { get, loading } = useBackendApi();
  const [subject, setSubject] = useState("");
  const [questionCount, setQuestionCount] = useState(5);

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
      console.log('Buscando questões:', { subject, questionCount });
      const response = await get<any>(`/questions?materia=${subject}&limit=${questionCount}`);
      console.log('Resposta da API:', response);

      if (!response) {
        toast({
          title: "Erro",
          description: "Não foi possível conectar ao servidor. Verifique sua conexão.",
          variant: "destructive",
        });
        return;
      }

      // Verificar se a resposta tem o formato esperado
      const questions = Array.isArray(response) ? response : response.items || [];
      
      if (questions.length === 0) {
        toast({
          title: "Nenhuma questão encontrada",
          description: "Não há questões disponíveis para esta matéria.",
          variant: "destructive",
        });
        return;
      }

      console.log('Questões recebidas:', questions);

      toast({
        title: "Atividade Criada",
        description: `Atividade com ${questions.length} questões criada com sucesso!`,
      });

      // Aqui você pode navegar para uma página de visualização ou edição das questões
      // navigate("/teacher/preview-activity", { state: { questions } });
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
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
        <Button 
          onClick={() => navigate("/teacher")} 
          variant="outline" 
          className="mb-6 hover:scale-105 transition-all"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Dashboard
        </Button>

        <Card className="p-8 shadow-hover border-border/50">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Elaborar Atividade Personalizada</h1>
          <p className="text-muted-foreground mb-8">Escolha a matéria e quantidade de questões para a atividade</p>

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

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="questionCount">Quantidade de Questões</Label>
                <span className="text-2xl font-bold text-primary">{questionCount}</span>
              </div>
              <Slider
                id="questionCount"
                min={1}
                max={30}
                step={1}
                value={[questionCount]}
                onValueChange={(value) => setQuestionCount(value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1</span>
                <span>10</span>
                <span>20</span>
                <span>30</span>
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

export default CreateActivity;
