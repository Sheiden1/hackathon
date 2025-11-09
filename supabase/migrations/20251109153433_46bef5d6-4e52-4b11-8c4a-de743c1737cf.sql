-- Create subjects table
CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create questions table
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activities table
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activity_questions junction table
CREATE TABLE public.activity_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(activity_id, question_id)
);

-- Create activity_submissions table
CREATE TABLE public.activity_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'graded')),
  score DECIMAL(5,2),
  feedback TEXT
);

-- Create student_answers table
CREATE TABLE public.student_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.activity_submissions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_answer TEXT NOT NULL CHECK (selected_answer IN ('A', 'B', 'C', 'D')),
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subjects (publicly readable)
CREATE POLICY "Subjects are viewable by everyone"
ON public.subjects FOR SELECT
USING (true);

-- RLS Policies for questions (publicly readable)
CREATE POLICY "Questions are viewable by everyone"
ON public.questions FOR SELECT
USING (true);

CREATE POLICY "Teachers can create questions"
ON public.questions FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- RLS Policies for activities
CREATE POLICY "Activities are viewable by everyone"
ON public.activities FOR SELECT
USING (true);

CREATE POLICY "Teachers can create activities"
ON public.activities FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Teachers can update their activities"
ON public.activities FOR UPDATE
USING (auth.uid() = created_by);

-- RLS Policies for activity_questions
CREATE POLICY "Activity questions are viewable by everyone"
ON public.activity_questions FOR SELECT
USING (true);

CREATE POLICY "Teachers can add questions to activities"
ON public.activity_questions FOR INSERT
WITH CHECK (true);

-- RLS Policies for activity_submissions
CREATE POLICY "Students can view their own submissions"
ON public.activity_submissions FOR SELECT
USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view all submissions"
ON public.activity_submissions FOR SELECT
USING (true);

CREATE POLICY "Students can create their own submissions"
ON public.activity_submissions FOR INSERT
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Teachers can update submissions"
ON public.activity_submissions FOR UPDATE
USING (true);

-- RLS Policies for student_answers
CREATE POLICY "Students can view their own answers"
ON public.student_answers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.activity_submissions
    WHERE id = student_answers.submission_id
    AND student_id = auth.uid()
  )
);

CREATE POLICY "Teachers can view all answers"
ON public.student_answers FOR SELECT
USING (true);

CREATE POLICY "Students can insert their own answers"
ON public.student_answers FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.activity_submissions
    WHERE id = student_answers.submission_id
    AND student_id = auth.uid()
  )
);

-- Insert initial subjects
INSERT INTO public.subjects (name, description) VALUES
('Matemática', 'Questões de matemática do ensino fundamental e médio'),
('Português', 'Questões de língua portuguesa e literatura'),
('Ciências', 'Questões de ciências naturais e biologia'),
('História', 'Questões de história geral e do Brasil'),
('Geografia', 'Questões de geografia física e humana');