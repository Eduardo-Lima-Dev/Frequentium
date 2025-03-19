import React from 'react';

interface PaginationProps {
    totalPlayers: number;
    playersPerPage: number;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination: React.FC<PaginationProps> = ({ totalPlayers, playersPerPage, currentPage, setCurrentPage }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalPlayers / playersPerPage); i++) {
        pageNumbers.push(i);
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="flex justify-center mt-4">
            <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-white bg-gray-700 rounded-lg mr-2"
            >
                &laquo; Anterior
            </button>
            {pageNumbers.map((number) => (
                <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-4 py-2 text-white ${currentPage === number ? 'bg-green-500' : 'bg-gray-600'} rounded-lg mr-2`}
                >
                    {number}
                </button>
            ))}
            <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === pageNumbers.length}
                className="px-4 py-2 text-white bg-gray-700 rounded-lg ml-2"
            >
                Próximo &raquo;
            </button>
        </div>
    );
};

export default Pagination;
