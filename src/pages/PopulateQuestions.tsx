import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2, Sparkles, CheckCircle } from "lucide-react";

interface Subject {
  id: string;
  name: string;
  description: string;
}

const PopulateQuestions = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [generated, setGenerated] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .order("name");

    if (error) {
      console.error("Erro ao buscar matérias:", error);
      return;
    }

    setSubjects(data || []);
  };

  const generateQuestions = async (subjectId: string, subjectName: string) => {
    setLoading({ ...loading, [subjectId]: true });

    try {
      const { data, error } = await supabase.functions.invoke("generate-questions", {
        body: {
          subjectId,
          subjectName,
          count: 10,
        },
      });

      if (error) throw error;

      if (data.success) {
        setGenerated({ ...generated, [subjectId]: true });
        toast({
          title: "Questões geradas!",
          description: `${data.count} questões de ${subjectName} foram criadas com sucesso.`,
        });
      }
    } catch (error: any) {
      console.error("Erro ao gerar questões:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível gerar as questões.",
        variant: "destructive",
      });
    } finally {
      setLoading({ ...loading, [subjectId]: false });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold text-foreground mb-2">
              Gerar Questões com IA
            </h1>
            <p className="text-muted-foreground">
              Popule o banco de dados com questões geradas por inteligência artificial
            </p>
          </div>

          <div className="grid gap-4">
            {subjects.map((subject) => (
              <Card key={subject.id} className="p-6 shadow-hover border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {subject.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {subject.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    {generated[subject.id] ? (
                      <div className="flex items-center gap-2 text-green-500">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">Geradas</span>
                      </div>
                    ) : (
                      <Button
                        onClick={() => generateQuestions(subject.id, subject.name)}
                        disabled={loading[subject.id]}
                        className="gap-2"
                      >
                        {loading[subject.id] ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Gerando...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            Gerar 10 Questões
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8">
            <Card className="p-6 bg-muted/50">
              <h3 className="font-bold text-foreground mb-2">ℹ️ Informação</h3>
              <p className="text-sm text-muted-foreground">
                Cada matéria gerará 10 questões com diferentes níveis de dificuldade.
                As questões são criadas usando IA e salvas automaticamente no banco de dados.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopulateQuestions;
