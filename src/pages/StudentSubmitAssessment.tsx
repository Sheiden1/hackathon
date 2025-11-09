import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StudentSubmitAssessment = ({ onBack }: { onBack: () => void }) => {
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [activityType, setActivityType] = useState("");
  const [title, setTitle] = useState("");
  const [comments, setComments] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Avaliação Enviada",
      description: "Sua avaliação foi enviada com sucesso!",
    });
    setSubject("");
    setActivityType("");
    setTitle("");
    setComments("");
    setFiles([]);
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

        <Card className="p-8 shadow-hover border-border/50">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Entregar Avaliação
          </h1>
          <p className="text-muted-foreground mb-8">
            Envie suas avaliações e trabalhos concluídos
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="subject">Matéria</Label>
                <Select value={subject} onValueChange={setSubject} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a matéria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matematica">Matemática</SelectItem>
                    <SelectItem value="portugues">Português</SelectItem>
                    <SelectItem value="ciencias">Ciências</SelectItem>
                    <SelectItem value="historia">História</SelectItem>
                    <SelectItem value="geografia">Geografia</SelectItem>
                    <SelectItem value="ingles">Inglês</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activityType">Tipo de Atividade</Label>
                <Select value={activityType} onValueChange={setActivityType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prova">Prova</SelectItem>
                    <SelectItem value="trabalho">Trabalho</SelectItem>
                    <SelectItem value="exercicio">Lista de Exercícios</SelectItem>
                    <SelectItem value="projeto">Projeto</SelectItem>
                    <SelectItem value="redacao">Redação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Título da Avaliação</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Prova Bimestral - Capítulo 3"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Comentários (opcional)</Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Adicione observações sobre a entrega"
                rows={4}
              />
            </div>

            <div className="space-y-4">
              <Label>Arquivos</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Clique para fazer upload ou arraste os arquivos
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, DOC, DOCX, JPG, PNG (máx. 10MB)
                  </p>
                </label>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <Label>Arquivos Selecionados</Label>
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-foreground">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({(file.size / 1024).toFixed(2)} KB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={files.length === 0}>
              Enviar Avaliação
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default StudentSubmitAssessment;
