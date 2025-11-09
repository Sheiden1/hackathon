import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, FileCheck, Star, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface Submission {
  id: string;
  student_id: string;
  activity_id: string;
  submitted_at: string;
  status: string;
  score: number | null;
  feedback: string | null;
  activities: {
    title: string;
    description: string;
  } | null;
}

const CorrectAssessment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("activity_submissions")
        .select(`
          id,
          student_id,
          activity_id,
          submitted_at,
          status,
          score,
          feedback,
          activities!inner (
            title,
            description
          )
        `)
        .order("submitted_at", { ascending: false });

      if (error) throw error;

      // Transformar os dados para o formato correto
      const transformedData = data?.map(submission => ({
        ...submission,
        activities: Array.isArray(submission.activities) ? submission.activities[0] : submission.activities
      })) as Submission[];

      setSubmissions(transformedData || []);
    } catch (error: any) {
      console.error("Erro ao buscar submissões:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as submissões.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGrade(submission.score?.toString() || "");
    setFeedback(submission.feedback || "");
  };

  const handleSubmitCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSubmission) return;

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("activity_submissions")
        .update({
          score: parseFloat(grade),
          feedback: feedback,
          status: "graded",
        })
        .eq("id", selectedSubmission.id);

      if (error) throw error;

      toast({
        title: "Correção salva",
        description: "A nota e feedback foram enviados ao aluno.",
      });

      // Atualizar a lista de submissões
      await fetchSubmissions();
      
      setSelectedSubmission(null);
      setGrade("");
      setFeedback("");
    } catch (error: any) {
      console.error("Erro ao salvar correção:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a correção.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-12 animate-fade-in">
          <Button
            onClick={() => selectedSubmission ? setSelectedSubmission(null) : navigate("/teacher")}
            variant="outline"
            size="icon"
            className="hover:scale-105 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground">
              Avaliar Atividades
            </h1>
            <p className="text-muted-foreground font-medium mt-1">
              {selectedSubmission 
                ? "Adicione nota e feedback para o aluno"
                : `${submissions.length} submissões para avaliar`}
            </p>
          </div>
        </div>

        {selectedSubmission ? (
          <Card className="p-8 border border-border/50 shadow-card animate-scale-up">
            <div className="mb-6">
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                {selectedSubmission.activities?.title || "Sem título"}
              </h2>
              <p className="text-muted-foreground">
                {selectedSubmission.activities?.description || "Sem descrição"}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Submetido em: {new Date(selectedSubmission.submitted_at).toLocaleString("pt-BR")}
              </p>
            </div>

            <form onSubmit={handleSubmitCorrection} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="grade" className="text-foreground font-medium">
                  Nota (0-100)
                </Label>
                <div className="relative group">
                  <Star className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent transition-all group-focus-within:scale-110" />
                  <Input
                    id="grade"
                    type="number"
                    min="0"
                    max="100"
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
                  onClick={() => setSelectedSubmission(null)}
                  className="flex-1"
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-primary hover:shadow-hover text-white"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Correção"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          <div className="space-y-4">
            {submissions.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  Nenhuma submissão para avaliar no momento.
                </p>
              </Card>
            ) : (
              submissions.map((submission, index) => (
                <Card
                  key={submission.id}
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
                          {submission.activities?.title || "Sem título"}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {submission.activities?.description || "Sem descrição"}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            Submetido em: {new Date(submission.submitted_at).toLocaleString("pt-BR")}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            submission.status === "graded" 
                              ? "bg-green-100 text-green-700" 
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {submission.status === "graded" ? "Avaliada" : "Pendente"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleSelectSubmission(submission)}
                      className="bg-gradient-primary hover:shadow-hover text-white"
                    >
                      {submission.status === "graded" ? "Ver Correção" : "Avaliar"}
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CorrectAssessment;
