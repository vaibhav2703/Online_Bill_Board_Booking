import React from 'react';
import { FileQuestion } from 'lucide-react';

const EmptyState = ({
    icon: Icon = FileQuestion,
    title = 'No data found',
    description = '',
    action = null
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="rounded-full bg-gray-100 p-6 mb-4">
                <Icon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-gray-500 mb-4 max-w-md">{description}</p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
};

export default EmptyState;
