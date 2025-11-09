import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GraduationCap, CheckCircle, FileEdit, Plus, LogOut, Sparkles, BarChart3, FileUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const menuOptions = [
    {
      id: "add-file",
      title: "Adicionar Arquivo",
      description: "Envie materiais e documentos",
      icon: FileUp,
      gradient: "bg-gradient-accent",
    },
    {
      id: "add-question",
      title: "Adicionar Questão",
      description: "Monte seu banco de questões para provas e exercícios",
      icon: Plus,
      gradient: "bg-gradient-primary",
    },
    {
      id: "create-activity",
      title: "Elaborar Atividade",
      description: "Crie novas atividades e trabalhos para seus alunos",
      icon: FileEdit,
      gradient: "bg-gradient-secondary",
    },
    {
      id: "correct-assessment",
      title: "Avaliar Atividades",
      description: "Revise e corrija as avaliações enviadas pelos alunos",
      icon: CheckCircle,
      gradient: "bg-gradient-to-br from-green-500 via-emerald-400 to-green-500",
    },
  ];

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File selected:", file.name);
      // Handle file upload logic here
    }
  };

  const handleOptionClick = (optionId: string) => {
    if (optionId === "add-file") {
      handleFileClick();
      return;
    }

    const routes = {
      "correct-assessment": "/teacher/correct-assessment",
      "create-activity": "/teacher/create-activity",
      "add-question": "/teacher/add-question"
    };
    
    navigate(routes[optionId as keyof typeof routes]);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-2xl bg-gradient-primary shadow-card">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-display font-bold text-foreground">
                  Olá, Prof. {user?.name}!
                </h1>
                <p className="text-muted-foreground font-medium mt-1">
                  {user?.subject} - {user?.institution}
                </p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground ml-16">
              Inspire seus alunos com excelência!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full h-12 w-12 hover:scale-105 transition-all">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-primary text-white font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-primary text-white font-bold text-lg">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-display font-bold text-foreground">{user?.name}</h3>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground font-medium">Instituição</span>
                      <p className="font-semibold text-foreground">{user?.institution}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground font-medium">Disciplina</span>
                      <p className="font-semibold text-foreground">{user?.subject}</p>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button
              onClick={logout}
              variant="outline"
              className="flex items-center gap-2 hover:border-destructive hover:text-destructive transition-all hover:scale-105"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

        {/* Welcome Card */}
        <Card className="p-8 mb-8 bg-gradient-primary text-white shadow-hover border-0 animate-scale-up">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-display font-bold mb-2">Painel do Professor</h2>
              <p className="text-white/90 font-medium">
                Gerencie suas turmas, atividades e avaliações com facilidade
              </p>
            </div>
            <Sparkles className="h-12 w-12 text-white/80 animate-bounce-subtle" />
          </div>
        </Card>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.txt"
        />

        {/* Menu Options - Grid 2x2 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {menuOptions.map((option, index) => (
            <Card
              key={option.id}
              className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-hover hover:scale-[1.02] active:scale-[0.98] border border-border/50 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleOptionClick(option.id)}
            >
              <div className="p-8">
                <div className={`inline-flex p-4 rounded-2xl ${option.gradient} shadow-card mb-6 group-hover:scale-110 transition-all`}>
                  <option.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {option.title}
                </h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  {option.description}
                </p>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${option.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center animate-fade-in">
          <p className="text-muted-foreground font-medium">
            Educação transforma vidas
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
