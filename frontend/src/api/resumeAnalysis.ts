import axiosClient from './axiosClient';

export interface ResumeAnalysis {
    id: string;
    resume_id: number;
    score: number | null;
    strengths: string[] | null;
    missing_skills: string[] | null;
    suggestions: string[] | null;
    status: 'pending' | 'success' | 'failed';
    error_message: string | null;
    analyzed_at: string | null;
    created_at: string;
}

export interface ResumeAnalysisListItem {
    id: string;
    resume_id: number;
    score: number | null;
    status: string;
    analyzed_at: string | null;
    created_at: string;
}

/**
 * Start AI analysis for a resume
 */
export const startResumeAnalysis = async (resumeId: number): Promise<ResumeAnalysis> => {
    const response = await axiosClient.post(`/resumes/${resumeId}/analyze`);
    return response.data;
};

/**
 * Get analysis details by ID
 */
export const getAnalysisById = async (analysisId: string): Promise<ResumeAnalysis> => {
    const response = await axiosClient.get(`/resumes/analysis/${analysisId}`);
    return response.data;
};

/**
 * List all analyses for a resume
 */
export const listAnalysesForResume = async (resumeId: number): Promise<ResumeAnalysisListItem[]> => {
    const response = await axiosClient.get(`/resumes/${resumeId}/analysis`);
    return response.data;
};

/**
 * Re-run analysis for an existing analysis
 */
export const rescanAnalysis = async (analysisId: string): Promise<ResumeAnalysis> => {
    const response = await axiosClient.post(`/resumes/analysis/${analysisId}/rescan`);
    return response.data;
};
