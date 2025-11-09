import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, TrendingUp, AlertCircle, CheckCircle, FileEdit, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const TeacherAnalytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for Proficiência
  const proficiencyData = [
    { name: "Matemática", value: 85 },
    { name: "Português", value: 78 },
    { name: "Ciências", value: 92 },
    { name: "História", value: 88 },
    { name: "Geografia", value: 75 },
  ];

  // Mock data for Taxa de Erro
  const errorRateData = [
    { month: "Jan", taxa: 12 },
    { month: "Fev", taxa: 15 },
    { month: "Mar", taxa: 10 },
    { month: "Abr", taxa: 8 },
    { month: "Mai", taxa: 14 },
    { month: "Jun", taxa: 11 },
  ];

  const overallProficiency = 83.6;
  const overallErrorRate = 11.7;

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
          <div className="flex items-center gap-4">
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
                Dashboard de Métricas
              </h1>
              <p className="text-muted-foreground font-medium mt-1">
                Acompanhe o desempenho das suas turmas
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border border-border/50 hover:shadow-card transition-all animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Avaliações Pendentes</p>
                <p className="text-3xl font-display font-bold text-primary">12</p>
              </div>
              <CheckCircle className="h-10 w-10 text-primary/20" />
            </div>
          </Card>
          <Card className="p-6 border border-border/50 hover:shadow-card transition-all animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Atividades Criadas</p>
                <p className="text-3xl font-display font-bold text-secondary">24</p>
              </div>
              <FileEdit className="h-10 w-10 text-secondary/20" />
            </div>
          </Card>
          <Card className="p-6 border border-border/50 hover:shadow-card transition-all animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Questões no Banco</p>
                <p className="text-3xl font-display font-bold text-accent">156</p>
              </div>
              <Plus className="h-10 w-10 text-accent/20" />
            </div>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 border border-border/50 hover:shadow-card transition-all animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-primary">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm text-muted-foreground font-medium">Proficiência Geral</h3>
                <p className="text-3xl font-display font-bold text-primary">{overallProficiency}%</p>
              </div>
            </div>
            <Progress value={overallProficiency} className="h-2" />
          </Card>

          <Card className="p-6 border border-border/50 hover:shadow-card transition-all animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-secondary">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm text-muted-foreground font-medium">Taxa de Erro Média</h3>
                <p className="text-3xl font-display font-bold text-secondary">{overallErrorRate}%</p>
              </div>
            </div>
            <Progress value={overallErrorRate} className="h-2" />
          </Card>
        </div>

        {/* Proficiência por Disciplina */}
        <Card className="p-6 mb-8 border border-border/50 shadow-card animate-fade-in" style={{ animationDelay: '500ms' }}>
          <h2 className="text-2xl font-display font-bold mb-6 text-foreground flex items-center gap-2">
            Proficiência por Disciplina
          </h2>
          <div className="space-y-6">
            {proficiencyData.map((item, index) => (
              <div key={item.name} className="space-y-2 animate-fade-in" style={{ animationDelay: `${300 + index * 50}ms` }}>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">{item.name}</span>
                  <span className="text-primary font-bold">{item.value}%</span>
                </div>
                <Progress value={item.value} className="h-3" />
              </div>
            ))}
          </div>
        </Card>

        {/* Taxa de Erro ao Longo do Tempo */}
        <Card className="p-6 border border-border/50 shadow-card animate-fade-in" style={{ animationDelay: '600ms' }}>
          <h2 className="text-2xl font-display font-bold mb-6 text-foreground flex items-center gap-2">
            Taxa de Erro ao Longo do Tempo
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={errorRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Legend />
              <Bar dataKey="taxa" fill="hsl(var(--secondary))" name="Taxa de Erro (%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center animate-fade-in">
          <p className="text-muted-foreground font-medium">
            Dados atualizados em tempo real
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherAnalytics;
