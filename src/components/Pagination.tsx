import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    totalItems,
    itemsPerPage,
    currentPage,
    setCurrentPage,
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-4 mt-6">
            <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                title="Anterior"
                className={`px-3 py-1 rounded transition-colors ${
                    currentPage === 1
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gray-700 hover:bg-gray-600'
                }`}
            >
                <FaChevronLeft />
            </button>
            
            <span className="text-lg font-medium">
                {currentPage}
            </span>

            <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                title="Próximo"
                className={`px-3 py-1 rounded transition-colors ${
                    currentPage === totalPages
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gray-700 hover:bg-gray-600'
                }`}
            >
                <FaChevronRight />
            </button>
        </div>
    );
};

export default Pagination;
