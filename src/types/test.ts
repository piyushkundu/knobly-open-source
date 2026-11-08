export interface Test {
    id: string;
    title: string;
    description?: string;
    category: string;
    level_id?: string;
    questions: Question[];
    duration_minutes: number;
    total_points: number;
    created_by: string;
    created_at?: string;
    is_active: boolean;
}

export interface Question {
    id: string;
    text: string;
    options: string[];
    correct_answer: number;
    points: number;
    explanation?: string;
}

export interface TestResult {
    id: string;
    test_id: string;
    user_id: string;
    score: number;
    total_points: number;
    answers: Record<string, number>;
    completed_at: string;
    time_taken_seconds: number;
    warnings: number;
}
