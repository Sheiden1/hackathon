import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AddQuestion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [generateData, setGenerateData] = useState({
    file: null as File | null,
    numberOfQuestions: 5,
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!generateData.file) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Enviando arquivo",
        description: "Aguarde enquanto enviamos o arquivo...",
      });

      // 1. Upload do PDF para o Cloud Storage
      const formData = new FormData();
      formData.append("file", generateData.file);
      const timestamp = Date.now();
      const blobPath = `materiais/${timestamp}_${generateData.file.name}`;
      formData.append("blob_path", blobPath);
      formData.append("bucket", "materiais-hackaton");

      console.log("Enviando arquivo:", blobPath);

      const uploadResponse = await fetch(
        "https://backend-hackaton-2-739886072483.europe-west1.run.app/storage/gcs/upload",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("Erro no upload:", errorText);
        throw new Error("Erro ao fazer upload do arquivo");
      }

      const uploadResult = await uploadResponse.json();
      console.log("Upload result:", uploadResult);

      toast({
        title: "Gerando questões",
        description: "Aguarde enquanto a IA processa o documento...",
      });

      // 2. Gerar e salvar questões
      const requestBody = {
        bucket: "materiais-hackaton",
        caminho_no_bucket: blobPath,
        qtd_questoes: generateData.numberOfQuestions,
        serie: "1 ano médio",
        modelo: "gemini-2.5-flash",
        ineditas: true,
        dpi: 150,
        max_paginas: 10,
        como_png: false,
        qualidade_jpeg: 85,
        tamanho_lote: 5,
      };

      console.log("Request body:", requestBody);

      const generateResponse = await fetch(
        "https://backend-hackaton-2-739886072483.europe-west1.run.app/question-generation/complete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (!generateResponse.ok) {
        const errorText = await generateResponse.text();
        console.error("Erro na geração:", errorText);
        throw new Error(`Erro ao gerar questões: ${errorText}`);
      }

      const result = await generateResponse.json();
      console.log("Generate result:", result);

      toast({
        title: "Questões geradas com sucesso!",
        description: `${result.quantidade} questões foram adicionadas ao banco.`,
      });

      setGenerateData({
        file: null,
        numberOfQuestions: 5,
      });

      // Reset input file
      const fileInput = document.getElementById("file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Erro completo:", error);
      toast({
        title: "Erro ao processar arquivo",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
        variant: "destructive",
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
            <h1 className="text-4xl font-display font-bold text-foreground">Adicionar Questão</h1>
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
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">Adicionar Questão</h2>
            <p className="text-muted-foreground">
              Crie uma nova questão ou gere questões automaticamente a partir de um arquivo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="file" className="text-foreground font-medium">
                Selecionar Arquivo PDF
              </Label>
              <div className="relative">
                <Input
                  id="file"
                  type="file"
                  accept=".pdf"
                  className="w-full h-12 cursor-pointer file:cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 text-sm text-muted-foreground"
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
                onChange={(e) =>
                  setGenerateData({ ...generateData, numberOfQuestions: parseInt(e.target.value) || 5 })
                }
                required
              />
              <p className="text-sm text-muted-foreground">
                Defina quantas questões deseja gerar a partir do PDF
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate("/teacher")} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-accent hover:shadow-hover text-white">
                Gerar Questões
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddQuestion;
