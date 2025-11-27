import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import {
    ArrowLeft,
    RefreshCw,
    CheckCircle2,
    Lightbulb,
    TrendingUp,
    AlertTriangle,
    Tag
} from 'lucide-react';
import { getAnalysisById, rescanAnalysis, type ResumeAnalysis } from '../api/resumeAnalysis';
import AnalysisStatusBadge from '../components/AnalysisStatusBadge';

const ResumeAnalysisPage: React.FC = () => {
    const { analysisId } = useParams<{ analysisId: string }>();
    const navigate = useNavigate();
    const { success, error: showError } = useToast();

    const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
    const [loading, setLoading] = useState(true);
    const [rescanning, setRescanning] = useState(false);
    const [pollCount, setPollCount] = useState(0);

    useEffect(() => {
        if (analysisId) {
            fetchAnalysis();
        }
    }, [analysisId]);

    // Polling for pending analyses
    useEffect(() => {
        if (analysis?.status === 'pending' && pollCount < 20) {
            const interval = setInterval(() => {
                fetchAnalysis(true);
                setPollCount(prev => prev + 1);
            }, 5000); // Poll every 5 seconds

            return () => clearInterval(interval);
        }
    }, [analysis?.status, pollCount]);

    const fetchAnalysis = async (silent: boolean = false) => {
        if (!analysisId) return;

        if (!silent) setLoading(true);

        try {
            const data = await getAnalysisById(analysisId);
            setAnalysis(data);

            // Reset poll count if status changed to success/failed
            if (data.status !== 'pending') {
                setPollCount(0);
            }
        } catch (err: any) {
            showError(err.response?.data?.detail || 'Failed to load analysis');
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const handleRescan = async () => {
        if (!analysisId) return;

        setRescanning(true);
        try {
            const data = await rescanAnalysis(analysisId);
            setAnalysis(data);
            setPollCount(0);
            success('Analysis rescanning started!');
        } catch (err: any) {
            showError(err.response?.data?.detail || 'Failed to rescan analysis');
        } finally {
            setRescanning(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-light-100 mb-2">
                    Analysis Not Found
                </h2>
                <p className="text-gray-600 dark:text-dim-300 mb-6">
                    The requested analysis could not be found.
                </p>
                <button
                    onClick={() => navigate('/upload-resume')}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                    Go to Resumes
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/upload-resume')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-night-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Resume Analysis
                        </h1>
                        <p className="text-gray-600 dark:text-dim-300 mt-1">
                            AI-powered feedback on your resume
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleRescan}
                    disabled={rescanning || analysis.status === 'pending'}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <RefreshCw className={`w-4 h-4 ${rescanning ? 'animate-spin' : ''}`} />
                    {rescanning ? 'Rescanning...' : 'Rescan'}
                </button>
            </div>

            {/* Status and Score Card */}
            <div className="bg-white dark:bg-jet-900 rounded-xl shadow-soft p-6 border border-gray-200 dark:border-dim-700">
                <div className="flex items-center justify-between mb-6">
                    <AnalysisStatusBadge status={analysis.status} />
                    <div className="text-sm text-gray-500 dark:text-dim-400">
                        {analysis.analyzed_at
                            ? `Analyzed ${new Date(analysis.analyzed_at).toLocaleString()}`
                            : `Created ${new Date(analysis.created_at).toLocaleString()}`
                        }
                    </div>
                </div>

                {analysis.status === 'success' && analysis.score !== null && (
                    <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 mb-4">
                            <div className="text-5xl font-bold text-primary-600 dark:text-primary-400">
                                {analysis.score}
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-dim-300 text-lg">
                            Overall Resume Score
                        </p>
                    </div>
                )}

                {analysis.status === 'failed' && analysis.error_message && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-red-900 dark:text-red-400 mb-1">
                                    Analysis Failed
                                </h3>
                                <p className="text-red-700 dark:text-red-500 text-sm">
                                    {analysis.error_message}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {analysis.status === 'pending' && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                            <p className="text-blue-700 dark:text-blue-400">
                                Your resume is being analyzed. This may take 30-60 seconds...
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Strengths */}
            {analysis.strengths && analysis.strengths.length > 0 && (
                <div className="bg-white dark:bg-jet-900 rounded-xl shadow-soft p-6 border border-gray-200 dark:border-dim-700">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-light-100">
                            Strengths
                        </h2>
                    </div>
                    <ul className="space-y-3">
                        {analysis.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-dim-200">{strength}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Missing Skills */}
            {analysis.missing_skills && analysis.missing_skills.length > 0 && (
                <div className="bg-white dark:bg-jet-900 rounded-xl shadow-soft p-6 border border-gray-200 dark:border-dim-700">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                            <Tag className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-light-100">
                            Skills to Consider Adding
                        </h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {analysis.missing_skills.map((skill, index) => (
                            <span
                                key={index}
                                className="px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800 rounded-full text-sm font-medium"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Suggestions */}
            {analysis.suggestions && analysis.suggestions.length > 0 && (
                <div className="bg-white dark:bg-jet-900 rounded-xl shadow-soft p-6 border border-gray-200 dark:border-dim-700">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-light-100">
                            Improvement Suggestions
                        </h2>
                    </div>
                    <ol className="space-y-3 list-decimal list-inside">
                        {analysis.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-gray-700 dark:text-dim-200 pl-2">
                                {suggestion}
                            </li>
                        ))}
                    </ol>
                </div>
            )}
        </div>
    );
};

export default ResumeAnalysisPage;
