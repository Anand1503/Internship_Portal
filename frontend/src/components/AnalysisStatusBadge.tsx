import React from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface AnalysisStatusBadgeProps {
    status: 'pending' | 'success' | 'failed';
}

const AnalysisStatusBadge: React.FC<AnalysisStatusBadgeProps> = ({ status }) => {
    const statusConfig = {
        pending: {
            label: 'Analyzing...',
            icon: Loader2,
            className: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700',
            iconClassName: 'animate-spin',
        },
        success: {
            label: 'Complete',
            icon: CheckCircle,
            className: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700',
            iconClassName: '',
        },
        failed: {
            label: 'Failed',
            icon: XCircle,
            className: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700',
            iconClassName: '',
        },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium ${config.className}`}
            role="status"
            aria-label={`Analysis status: ${config.label}`}
        >
            <Icon className={`w-4 h-4 ${config.iconClassName}`} />
            {config.label}
        </span>
    );
};

export default AnalysisStatusBadge;
