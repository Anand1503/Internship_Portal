import React from 'react';

interface ResumeScoreBadgeProps {
    score: number;
    size?: 'sm' | 'md' | 'lg';
}

const ResumeScoreBadge: React.FC<ResumeScoreBadgeProps> = ({ score, size = 'md' }) => {
    // Determine color based on score
    const getColorClasses = (score: number): string => {
        if (score >= 75) {
            return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700';
        } else if (score >= 50) {
            return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700';
        } else {
            return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700';
        }
    };

    const getSizeClasses = (size: string): string => {
        switch (size) {
            case 'sm':
                return 'px-2 py-1 text-xs';
            case 'lg':
                return 'px-4 py-2 text-lg font-bold';
            default:
                return 'px-3 py-1.5 text-sm';
        }
    };

    return (
        <span
            className={`inline-flex items-center rounded-full border font-semibold ${getColorClasses(score)} ${getSizeClasses(size)}`}
            role="status"
            aria-label={`Resume score: ${score} out of 100`}
        >
            {score}/100
        </span>
    );
};

export default ResumeScoreBadge;
