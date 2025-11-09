import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AddQuestion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<"new" | "generate">("new");
  const [formData, setFormData] = useState({
    questionText: "",
    questionType: "multiple-choice",
    subject: "",
  });
  const [generateData, setGenerateData] = useState({
    file: null as File | null,
    numberOfQuestions: 5,
  });
  const [alternatives, setAlternatives] = useState([
    { id: 1, text: "", isCorrect: false },
    { id: 2, text: "", isCorrect: false },
    { id: 3, text: "", isCorrect: false },
    { id: 4, text: "", isCorrect: false },
  ]);

  const handleAddAlternative = () => {
    const newId = Math.max(...alternatives.map(a => a.id), 0) + 1;
    setAlternatives([...alternatives, { id: newId, text: "", isCorrect: false }]);
  };

  const handleRemoveAlternative = (id: number) => {
    if (alternatives.length > 2) {
      setAlternatives(alternatives.filter(a => a.id !== id));
    }
  };

  const handleAlternativeChange = (id: number, text: string) => {
    setAlternatives(alternatives.map(a => a.id === id ? { ...a, text } : a));
  };

  const handleCorrectChange = (id: number) => {
    setAlternatives(alternatives.map(a => ({ ...a, isCorrect: a.id === id })));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "new") {
      toast({
        title: "Questão adicionada com sucesso",
        description: "A questão foi salva no banco de questões.",
      });
      
      setFormData({
        questionText: "",
        questionType: "multiple-choice",
        subject: "",
      });
      setAlternatives([
        { id: 1, text: "", isCorrect: false },
        { id: 2, text: "", isCorrect: false },
        { id: 3, text: "", isCorrect: false },
        { id: 4, text: "", isCorrect: false },
      ]);
    } else {
      toast({
        title: "Gerando questões",
        description: "As questões estão sendo geradas a partir do arquivo.",
      });
      
      setGenerateData({
        file: null,
        numberOfQuestions: 5,
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
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
              Adicionar Questão
            </h1>
            <p className="text-muted-foreground font-medium mt-1">
              Monte seu banco de questões para provas e exercícios
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="p-8 border border-border/50 shadow-card animate-scale-up">
          <div className="mb-6">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-accent shadow-card mb-4">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Adicionar Questão
            </h2>
            <p className="text-muted-foreground">
              Crie uma nova questão ou gere questões automaticamente a partir de um arquivo
            </p>
          </div>

          {/* Mode Selector */}
          <div className="flex gap-2 p-1 bg-muted/30 rounded-lg mb-6">
            <button
              type="button"
              onClick={() => setMode("new")}
              className={`flex-1 px-4 py-3 rounded-md font-medium transition-all ${
                mode === "new"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Nova questão
            </button>
            <button
              type="button"
              onClick={() => setMode("generate")}
              className={`flex-1 px-4 py-3 rounded-md font-medium transition-all ${
                mode === "generate"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Gerar questão
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === "new" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-foreground font-medium">
                    Assunto
                  </Label>
                  <Input
                    id="subject"
                    placeholder="Ex: Matemática, História, Física..."
                    className="bg-muted/30 border-border focus:ring-2 focus:ring-accent"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="questionText" className="text-foreground font-medium">
                    Enunciado da Questão
                  </Label>
                  <Textarea
                    id="questionText"
                    placeholder="Escreva o enunciado completo da questão..."
                    className="min-h-[120px] bg-muted/30 border-border focus:ring-2 focus:ring-accent"
                    value={formData.questionText}
                    onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground font-medium">
                      Alternativas
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddAlternative}
                      className="hover:scale-105 transition-all"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Alternativa
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {alternatives.map((alt, index) => (
                      <Card key={alt.id} className="p-4 border border-border/50">
                        <div className="flex gap-3 items-start">
                          <div className="flex items-center gap-3 flex-1">
                            <input
                              type="radio"
                              name="correct"
                              checked={alt.isCorrect}
                              onChange={() => handleCorrectChange(alt.id)}
                              className="h-4 w-4 text-primary"
                            />
                            <div className="flex-1">
                              <Input
                                type="text"
                                placeholder={`Alternativa ${String.fromCharCode(65 + index)}`}
                                className="bg-muted/30 border-border"
                                value={alt.text}
                                onChange={(e) => handleAlternativeChange(alt.id, e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          {alternatives.length > 2 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveAlternative(alt.id)}
                              className="shrink-0 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Selecione a alternativa correta usando o botão de rádio
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="file" className="text-foreground font-medium">
                    Selecionar Arquivo
                  </Label>
                  <div className="relative">
                    <Input
                      id="file"
                      type="file"
                      className="w-full cursor-pointer file:cursor-pointer file:mr-2 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 text-sm text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap"
                      onChange={(e) => setGenerateData({ ...generateData, file: e.target.files?.[0] || null })}
                      required
                    />
                  </div>
                  {generateData.file && (
                    <p className="text-sm text-muted-foreground mt-2 truncate">
                      Arquivo selecionado: {generateData.file.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberOfQuestions" className="text-foreground font-medium">
                    Número de Questões
                  </Label>
                  <Input
                    id="numberOfQuestions"
                    type="number"
                    min="1"
                    max="50"
                    placeholder="Ex: 5"
                    className="bg-muted/30 border-border focus:ring-2 focus:ring-accent"
                    value={generateData.numberOfQuestions}
                    onChange={(e) => setGenerateData({ ...generateData, numberOfQuestions: parseInt(e.target.value) || 5 })}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Defina quantas questões deseja gerar a partir do arquivo
                  </p>
                </div>
              </>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/teacher")}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-accent hover:shadow-hover text-white"
              >
                {mode === "new" ? "Salvar Questão" : "Gerar Questões"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddQuestion;
