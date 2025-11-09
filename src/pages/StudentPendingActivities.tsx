import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, BookOpen } from "lucide-react";

const StudentPendingActivities = ({ onBack }: { onBack: () => void }) => {
  const mockActivities = [
    {
      id: 1,
      title: "Trabalho de História",
      subject: "História",
      dueDate: "2024-03-15",
      description: "Pesquisa sobre a Revolução Francesa",
      progress: 60,
      priority: "high",
    },
    {
      id: 2,
      title: "Lista de Exercícios - Matemática",
      subject: "Matemática",
      dueDate: "2024-03-18",
      description: "Resolver exercícios do capítulo 5",
      progress: 30,
      priority: "medium",
    },
    {
      id: 3,
      title: "Leitura - Português",
      subject: "Português",
      dueDate: "2024-03-20",
      description: "Ler capítulos 1-3 do livro paradidático",
      progress: 0,
      priority: "low",
    },
    {
      id: 4,
      title: "Experimento de Ciências",
      subject: "Ciências",
      dueDate: "2024-03-22",
      description: "Realizar experimento sobre estados da matéria",
      progress: 80,
      priority: "medium",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta";
      case "medium":
        return "Média";
      case "low":
        return "Baixa";
      default:
        return "Média";
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
          Voltar ao Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Atividades Pendentes
          </h1>
          <p className="text-muted-foreground">
            Veja todas as suas tarefas e trabalhos pendentes
          </p>
        </div>

        <div className="grid gap-6">
          {mockActivities.map((activity, index) => (
            <Card
              key={activity.id}
              className="p-6 shadow-hover border-border/50 hover:scale-[1.01] transition-all animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-gradient-secondary">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-foreground">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.subject}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground ml-12">
                    {activity.description}
                  </p>
                </div>

                <Badge className={getPriorityColor(activity.priority)}>
                  Prioridade {getPriorityLabel(activity.priority)}
                </Badge>
              </div>

              <div className="space-y-3 ml-12">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Entrega: {new Date(activity.dueDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {Math.ceil(
                        (new Date(activity.dueDate).getTime() - new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      dias restantes
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-semibold text-foreground">{activity.progress}%</span>
                  </div>
                  <Progress value={activity.progress} className="h-2" />
                </div>

                <Button variant="default" className="w-full md:w-auto">
                  Continuar Atividade
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentPendingActivities;
