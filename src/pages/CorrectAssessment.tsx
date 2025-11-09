import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, FileCheck, User, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CorrectAssessment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedAssessment, setSelectedAssessment] = useState<number | null>(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");

  // Mock data de avaliações pendentes
  const pendingAssessments = [
    { id: 1, studentName: "João Silva", activity: "Prova de Matemática - Capítulo 3", submittedAt: "2025-01-05 14:30" },
    { id: 2, studentName: "Maria Santos", activity: "Trabalho de História - Revolução Industrial", submittedAt: "2025-01-05 15:45" },
    { id: 3, studentName: "Pedro Oliveira", activity: "Exercícios de Física - Cinemática", submittedAt: "2025-01-06 10:20" },
    { id: 4, studentName: "Ana Costa", activity: "Redação - Meio Ambiente", submittedAt: "2025-01-06 11:15" },
  ];

  const handleCorrect = (assessmentId: number) => {
    setSelectedAssessment(assessmentId);
  };

  const handleSubmitCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Correção salva com sucesso",
      description: "A nota e feedback foram enviados ao aluno.",
    });
    
    setSelectedAssessment(null);
    setGrade("");
    setFeedback("");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12 animate-fade-in">
          <Button
            onClick={() => navigate("/teacher")}
            variant="outline"
            size="icon"
            className="hover:scale-105 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground">
              Corrigir Avaliações
            </h1>
            <p className="text-muted-foreground font-medium mt-1">
              Revise e corrija as avaliações enviadas pelos alunos
            </p>
          </div>
        </div>

        {selectedAssessment ? (
          // Correction Form
          <Card className="p-8 border border-border/50 shadow-card animate-scale-up">
            <div className="mb-6">
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                Corrigir Avaliação
              </h2>
              <p className="text-muted-foreground">
                {pendingAssessments.find(a => a.id === selectedAssessment)?.activity}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Aluno: {pendingAssessments.find(a => a.id === selectedAssessment)?.studentName}
              </p>
            </div>

            <form onSubmit={handleSubmitCorrection} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="grade" className="text-foreground font-medium">
                  Nota (0-10)
                </Label>
                <div className="relative group">
                  <Star className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent transition-all group-focus-within:scale-110" />
                  <Input
                    id="grade"
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    placeholder="Digite a nota"
                    className="pl-10 h-12 bg-muted/30 border-border focus:ring-2 focus:ring-accent"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback" className="text-foreground font-medium">
                  Feedback para o aluno
                </Label>
                <Textarea
                  id="feedback"
                  placeholder="Escreva aqui seus comentários e sugestões..."
                  className="min-h-[200px] bg-muted/30 border-border focus:ring-2 focus:ring-primary"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedAssessment(null)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-primary hover:shadow-hover text-white"
                >
                  Salvar Correção
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          // List of Pending Assessments
          <div className="space-y-4">
            {pendingAssessments.map((assessment, index) => (
              <Card
                key={assessment.id}
                className="p-6 border border-border/50 hover:shadow-card transition-all animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1">
                    <div className="p-3 rounded-2xl bg-gradient-primary shrink-0">
                      <FileCheck className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-display font-bold text-foreground mb-1">
                        {assessment.activity}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <User className="h-4 w-4" />
                        <span>{assessment.studentName}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Enviado em: {assessment.submittedAt}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleCorrect(assessment.id)}
                    className="bg-gradient-primary hover:shadow-hover text-white"
                  >
                    Corrigir
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CorrectAssessment;
