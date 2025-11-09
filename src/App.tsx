import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import StudentDoActivity from "./pages/StudentDoActivity";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherAnalytics from "./pages/TeacherAnalytics";
import CorrectAssessment from "./pages/CorrectAssessment";
import CreateActivity from "./pages/CreateActivity";
import AddQuestion from "./pages/AddQuestion";
import PopulateQuestions from "./pages/PopulateQuestions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/do-activity" element={<StudentDoActivity />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/teacher/analytics" element={<TeacherAnalytics />} />
            <Route path="/teacher/correct-assessment" element={<CorrectAssessment />} />
            <Route path="/teacher/create-activity" element={<CreateActivity />} />
            <Route path="/teacher/add-question" element={<AddQuestion />} />
            <Route path="/teacher/populate-questions" element={<PopulateQuestions />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
