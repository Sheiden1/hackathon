import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from "pdfjs-dist";

// Configure worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface Flashcard {
  question: string;
  answer: string;
}

export const PDFFlashcardGenerator = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos PDF",
        variant: "destructive",
      });
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "O arquivo deve ter no máximo 5 MB",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    setFlashcards([]);
    setCurrentCard(0);
  };

  const generateFlashcards = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");
        fullText += pageText + " ";
      }

      // Simular geração de flashcards com base no texto
      const generatedFlashcards = generateFlashcardsFromText(fullText);
      setFlashcards(generatedFlashcards);
      setCurrentCard(0);
      setShowAnswer(false);

      toast({
        title: "Sucesso! 🎉",
        description: `${generatedFlashcards.length} flashcards gerados com sucesso!`,
      });
    } catch (error) {
      console.error("Erro ao processar PDF:", error);
      toast({
        title: "Erro",
        description: "Não foi possível processar o PDF",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const generateFlashcardsFromText = (text: string): Flashcard[] => {
    // Simulação simples: cria flashcards baseados em frases
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const flashcards: Flashcard[] = [];
    
    for (let i = 0; i < Math.min(10, sentences.length); i += 2) {
      if (sentences[i] && sentences[i + 1]) {
        flashcards.push({
          question: sentences[i].trim() + "?",
          answer: sentences[i + 1].trim()
        });
      }
    }

    return flashcards.length > 0 ? flashcards : [
      {
        question: "O que você aprendeu neste documento?",
        answer: "Flashcards gerados automaticamente a partir do conteúdo do PDF."
      }
    ];
  };

  const nextCard = () => {
    setShowAnswer(false);
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    setShowAnswer(false);
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Upload Section */}
      <Card className="p-8 border border-border/50 shadow-card hover:shadow-hover transition-all">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-accent shadow-card">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              Gerar Flashcards de PDF 📚
            </h2>
            <p className="text-muted-foreground font-medium">
              Faça upload de um PDF e transforme em flashcards interativos
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary transition-colors">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="pdf-upload"
            />
            <label
              htmlFor="pdf-upload"
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              <div className="p-4 rounded-2xl bg-primary/10">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  Clique para fazer upload
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  PDF até 5 MB
                </p>
              </div>
            </label>
          </div>

          {file && (
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">{file.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFile(null)}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Button
            onClick={generateFlashcards}
            disabled={!file || isProcessing}
            className="w-full bg-gradient-primary text-white font-semibold shadow-card hover:shadow-hover transition-all hover:scale-[1.02]"
          >
            {isProcessing ? "Processando..." : "Gerar Flashcards ✨"}
          </Button>
        </div>
      </Card>

      {/* Flashcards Display */}
      {flashcards.length > 0 && (
        <Card className="p-8 border border-border/50 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-display font-bold text-foreground">
              Seus Flashcards 🎯
            </h3>
            <span className="text-sm font-medium text-muted-foreground">
              {currentCard + 1} / {flashcards.length}
            </span>
          </div>

          <div
            className="relative min-h-[300px] bg-gradient-primary rounded-2xl p-8 flex items-center justify-center cursor-pointer group transition-all hover:shadow-hover"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            <div className="text-center">
              <p className="text-sm font-medium text-white/80 mb-4">
                {showAnswer ? "Resposta" : "Pergunta"}
              </p>
              <p className="text-xl font-display font-semibold text-white leading-relaxed">
                {showAnswer
                  ? flashcards[currentCard].answer
                  : flashcards[currentCard].question}
              </p>
              <p className="text-sm text-white/60 mt-6">
                Clique para {showAnswer ? "ver pergunta" : "revelar resposta"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              onClick={prevCard}
              disabled={flashcards.length <= 1}
              variant="outline"
              className="hover:bg-primary/10 hover:text-primary hover:border-primary transition-all"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            <Button
              onClick={nextCard}
              disabled={flashcards.length <= 1}
              variant="outline"
              className="hover:bg-primary/10 hover:text-primary hover:border-primary transition-all"
            >
              Próximo
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
