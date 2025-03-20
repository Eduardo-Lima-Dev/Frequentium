import React from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Game } from '../types/Game';

interface GameTableProps {
    games: Game[];
    editGame: (game: Game) => void;
    handleDeleteClick: (game: Game) => void;
    isLoading: boolean;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
};

const GameTable: React.FC<GameTableProps> = ({ games, editGame, handleDeleteClick, isLoading }) => {
    return (
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md w-full">
            {isLoading ? (
                <div className="flex justify-center items-center p-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
            ) : (
                <table className="table-auto min-w-full mx-auto table-fixed">
                    <thead className="bg-gray-700 text-left">
                        <tr>
                            <th className="px-6 py-4 text-center">Data</th>
                            <th className="px-6 py-4 text-center">Duração (min)</th>
                            <th className="px-6 py-4 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {games.map((game) => (
                            <tr key={game.id} className="border-b border-gray-700">
                                <td className="px-6 py-4 text-center">{formatDate(game.data)}</td>
                                <td className="px-6 py-4 text-center">{game.duracao}</td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => editGame(game)}
                                        className="text-green-500 mr-4"
                                        title="Editar"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(game)}
                                        className="text-red-500"
                                        title="Excluir"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default GameTable;
