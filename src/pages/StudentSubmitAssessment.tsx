import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Activity {
  id: string;
  title: string;
  description: string;
  subject_id: string;
  subjects: {
    name: string;
  } | null;
}

const StudentSubmitAssessment = ({ onBack }: { onBack: () => void }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    const { data, error } = await supabase
      .from("activities")
      .select(`
        id,
        title,
        description,
        subject_id,
        subjects!inner (
          name
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar atividades:", error);
      return;
    }

    // Transformar os dados para o formato correto
    const transformedData = data?.map(activity => ({
      ...activity,
      subjects: Array.isArray(activity.subjects) ? activity.subjects[0] : activity.subjects
    })) as Activity[];

    setActivities(transformedData || []);
  };

  const handleSubmit = async () => {
    if (!selectedActivity) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma atividade.",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para submeter uma atividade.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Buscar as questões da atividade
      const { data: activityQuestions, error: questionsError } = await supabase
        .from("activity_questions")
        .select(`
          question_id,
          questions (
            id,
            question_text,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_answer
          )
        `)
        .eq("activity_id", selectedActivity);

      if (questionsError) throw questionsError;

      // Redirecionar para fazer a atividade
      const questions = activityQuestions?.map((aq: any) => ({
        id: aq.questions.id,
        question: aq.questions.question_text,
        options: [
          aq.questions.option_a,
          aq.questions.option_b,
          aq.questions.option_c,
          aq.questions.option_d,
        ],
        correctAnswer: ["A", "B", "C", "D"].indexOf(aq.questions.correct_answer),
        subject: "",
      }));

      navigate("/student/do-activity", { state: { questions, activityId: selectedActivity } });
    } catch (error: any) {
      console.error("Erro ao buscar questões:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a atividade.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
          onClick={onBack}
          variant="outline"
          className="mb-6 hover:scale-105 transition-all"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Button>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Fazer Atividade
          </h1>
          <p className="text-muted-foreground mb-8">
            Selecione uma atividade para começar
          </p>

          <Card className="p-8 shadow-hover border-border/50">
            <h3 className="text-xl font-bold text-foreground mb-6">Atividades Disponíveis</h3>
            
            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma atividade disponível no momento.
                </p>
              ) : (
                activities.map((activity) => (
                  <Card
                    key={activity.id}
                    className={`p-4 cursor-pointer transition-all border-2 ${
                      selectedActivity === activity.id
                        ? "border-primary bg-primary/5"
                        : "border-border/50 hover:border-primary/30"
                    }`}
                    onClick={() => setSelectedActivity(activity.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground mb-1">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {activity.description}
                        </p>
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-secondary/20 text-secondary-foreground">
                          {activity.subjects?.name}
                        </span>
                      </div>
                      {selectedActivity === activity.id && (
                        <CheckCircle2 className="h-5 w-5 text-primary ml-4" />
                      )}
                    </div>
                  </Card>
                ))
              )}

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedActivity}
                className="w-full mt-6"
              >
                {isSubmitting ? "Carregando..." : "Fazer Atividade"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentSubmitAssessment;
