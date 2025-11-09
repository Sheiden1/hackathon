import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, FileEdit, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CreateActivity = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    class: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Atividade criada com sucesso",
      description: "A atividade foi disponibilizada para os alunos.",
    });
    
    setFormData({
      title: "",
      description: "",
      type: "",
      class: "",
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-soft" />
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
              Elaborar Atividade
            </h1>
            <p className="text-muted-foreground font-medium mt-1">
              Crie novas atividades e trabalhos para seus alunos
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="p-8 border border-border/50 shadow-card animate-scale-up">
          <div className="mb-6">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-secondary shadow-card mb-4">
              <FileEdit className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Nova Atividade
            </h2>
            <p className="text-muted-foreground">
              Preencha os detalhes da atividade que deseja criar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground font-medium">
                Título da Atividade
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Ex: Prova de Matemática - Capítulo 5"
                className="h-12 bg-muted/30 border-border focus:ring-2 focus:ring-secondary"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground font-medium">
                Descrição
              </Label>
              <Textarea
                id="description"
                placeholder="Descreva os objetivos e instruções da atividade..."
                className="min-h-[150px] bg-muted/30 border-border focus:ring-2 focus:ring-secondary"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-foreground font-medium">
                Tipo de Atividade
              </Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="h-12 bg-muted/30 border-border">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prova">Prova</SelectItem>
                  <SelectItem value="exercicio">Exercício</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="class" className="text-foreground font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Turma
              </Label>
              <Select value={formData.class} onValueChange={(value) => setFormData({ ...formData, class: value })}>
                <SelectTrigger className="h-12 bg-muted/30 border-border">
                  <SelectValue placeholder="Selecione a turma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9a">9º Ano A</SelectItem>
                  <SelectItem value="9b">9º Ano B</SelectItem>
                  <SelectItem value="1a">1º Médio A</SelectItem>
                  <SelectItem value="1b">1º Médio B</SelectItem>
                  <SelectItem value="2a">2º Médio A</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                className="flex-1 bg-gradient-secondary hover:shadow-hover text-white"
              >
                Criar Atividade
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateActivity;
