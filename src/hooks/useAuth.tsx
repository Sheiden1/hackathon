import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher";
  institution?: string;
  subject?: string;
  subject_id?: string;
  grade?: string;
  class?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (userData: Omit<User, "id"> & { password: string }) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session?.user) {
          // Fetch user profile data
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data && !error) {
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        institution: data.institution,
        subject: data.subject,
        subject_id: data.subject_id,
        grade: data.grade,
        class: data.class,
      });
    }
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      await fetchUserProfile(data.user.id);
      const profile = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      
      if (profile.data) {
        navigate(profile.data.role === "student" ? "/student" : "/teacher");
      }
    }

    return {};
  };

  const signup = async (userData: Omit<User, "id"> & { password: string }) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name: userData.name,
          role: userData.role,
        }
      }
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          institution: userData.institution,
          subject: userData.subject,
          subject_id: userData.subject_id,
          grade: userData.grade,
          class: userData.class,
        });

      if (profileError) {
        return { error: profileError.message };
      }

      // Fetch the profile to populate user state before navigating
      await fetchUserProfile(data.user.id);
      
      navigate(userData.role === "student" ? "/student" : "/teacher");
    }

    return {};
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    navigate("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
