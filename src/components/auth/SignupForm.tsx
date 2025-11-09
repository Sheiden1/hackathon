import { useState } from "react";
import { GraduationCap, Users } from "lucide-react";
import { TeacherSignupForm } from "./TeacherSignupForm";
import { StudentSignupForm } from "./StudentSignupForm";

interface SignupFormProps {
  onToggleMode: () => void;
}

type UserType = "teacher" | "student" | null;

export const SignupForm = ({ onToggleMode }: SignupFormProps) => {
  const [userType, setUserType] = useState<UserType>(null);

  if (userType === "teacher") {
    return <TeacherSignupForm onBack={() => setUserType(null)} onToggleMode={onToggleMode} />;
  }

  if (userType === "student") {
    return <StudentSignupForm onBack={() => setUserType(null)} onToggleMode={onToggleMode} />;
  }

  return (
    <div className="w-full max-w-2xl animate-scale-up">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Crie sua conta</h1>
        <p className="text-muted-foreground font-medium">Escolha seu perfil para começar</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <button
          onClick={() => setUserType("teacher")}
          className="group relative bg-card rounded-2xl p-8 border-2 border-border hover:border-primary transition-all duration-300 shadow-card hover:shadow-hover hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-5 rounded-2xl bg-gradient-primary shadow-soft group-hover:shadow-medium transition-all group-hover:scale-110">
              <GraduationCap className="h-12 w-12 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-foreground mb-2">Sou Professor</h3>
              <p className="text-sm text-muted-foreground font-medium">
                Compartilhe conhecimento e inspire seus alunos
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setUserType("student")}
          className="group relative bg-card rounded-2xl p-8 border-2 border-border hover:border-secondary transition-all duration-300 shadow-card hover:shadow-hover hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-5 rounded-2xl bg-gradient-secondary shadow-soft group-hover:shadow-medium transition-all group-hover:scale-110">
              <Users className="h-12 w-12 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-foreground mb-2">Sou Aluno</h3>
              <p className="text-sm text-muted-foreground font-medium">
                Aprenda e desenvolva suas habilidades
              </p>
            </div>
          </div>
        </button>
      </div>

      <div className="text-center pt-8">
        <p className="text-muted-foreground font-medium">
          Já tem uma conta?{" "}
          <button
            type="button"
            onClick={onToggleMode}
            className="text-primary hover:text-primary-hover font-semibold transition-all hover:scale-105 inline-block"
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
};
