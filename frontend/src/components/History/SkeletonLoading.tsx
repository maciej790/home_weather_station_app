import React from 'react';

const SkeletonLoading: React.FC = () => {
    return (
        <div className="mt-10 bg-white rounded-2xl shadow-md border border-gray-200 p-6 w-full animate-pulse">
            {/* Nagłówek tabeli */}
            <div className="h-6 bg-gray-300 rounded w-1/4 mb-4" />

            {/* Cały obszar tabeli */}
            <div className="w-full h-[400px] bg-gray-200 rounded-xl" />

            {/* Paginacja */}
            <div className="flex justify-between items-center mt-6">
                <div className="h-8 w-20 bg-gray-300 rounded" />
                <div className="h-8 w-20 bg-gray-300 rounded" />
                <div className="h-8 w-20 bg-gray-300 rounded" />
            </div>
        </div>
    );
};

export default SkeletonLoading;
