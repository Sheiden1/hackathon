import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  subject: string;
}

const StudentDoActivity = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const questions = location.state?.questions as Question[] || [];
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Nenhuma questão encontrada</h2>
          <Button onClick={() => navigate("/student")}>Voltar ao Dashboard</Button>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerClick = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(optionIndex);
    setIsAnswered(true);

    if (optionIndex === currentQuestion.correctAnswer) {
      setCorrectAnswers(correctAnswers + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Atividade finalizada
      const score = Math.round((correctAnswers / questions.length) * 100);
      toast({
        title: "Atividade Concluída!",
        description: `Você acertou ${correctAnswers} de ${questions.length} questões (${score}%)`,
      });
      navigate("/student");
    }
  };

  const getButtonVariant = (optionIndex: number) => {
    if (!isAnswered) return "outline";
    if (optionIndex === currentQuestion.correctAnswer) return "default";
    if (optionIndex === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer) return "destructive";
    return "outline";
  };

  const getButtonIcon = (optionIndex: number) => {
    if (!isAnswered) return null;
    if (optionIndex === currentQuestion.correctAnswer) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
    if (optionIndex === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    return null;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Questão {currentQuestionIndex + 1} de {questions.length}
              </span>
              <span className="text-sm font-semibold">
                Acertos: {correctAnswers}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="p-8 shadow-hover border-border/50 mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {currentQuestion.question}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  variant={getButtonVariant(index)}
                  className="w-full justify-start text-left h-auto py-4 px-6 transition-all"
                  disabled={isAnswered}
                >
                  <span className="flex-1">{option}</span>
                  {getButtonIcon(index)}
                </Button>
              ))}
            </div>
          </Card>

          {isAnswered && (
            <div className="flex justify-end">
              <Button
                onClick={handleNextQuestion}
                className="gap-2"
              >
                {currentQuestionIndex < questions.length - 1 ? (
                  <>
                    Próxima Questão
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  "Finalizar Atividade"
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDoActivity;
