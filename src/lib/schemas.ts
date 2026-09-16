export interface SummaryItem {
  id: string;
  location: string; // 예: "Pg. 3, Ln. 12"
  text: string;
}

export interface QuizItem {
  id: string;
  linked_summary_id: string;
  difficulty: "하" | "중" | "상";
  type: "multiple_choice" | "short_answer";
  question: string;
  options?: string[]; // 객관식일 경우 4개
  correct_answer: string;
  explanation: string;
  source_page: string;
}

export interface AnalysisResponse {
  document_title: string;
  summary: {
    key_conclusions: SummaryItem[];
    methodology: SummaryItem[];
    key_takeaways: SummaryItem[];
  };
  quizzes: QuizItem[];
}
