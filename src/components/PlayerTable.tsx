import React, { useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { deletePlayer } from '../services/api/playerService';
import DeleteModal from './modals/DeleteModal';
import { Player } from '../types/Player';
import toast from 'react-hot-toast';

interface PlayerTableProps {
    players: Player[];
    editPlayer: (player: Player) => void;
    setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
    isLoading: boolean;
}

const PlayerTable: React.FC<PlayerTableProps> = ({ players, editPlayer, setPlayers, isLoading }) => {
    const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDeleteClick = (player: Player) => {
        setPlayerToDelete(player);
        setIsModalOpen(true);
    };

    const handleDelete = async (playerId: number) => {
        try {
            await deletePlayer(playerId);
            setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== playerId));
            toast.success('Jogador excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir jogador', error);
            toast.error('Erro ao excluir jogador');
        } 
    };

    // Ordenar os jogadores por nome
    const sortedPlayers = [...players].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

    if (isLoading) {
        return (
            <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md w-full p-8">
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    <span className="ml-3 text-lg text-gray-400">Carregando jogadores...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md w-full">
            <table className="table-auto min-w-full mx-auto table-fixed">
                <thead className="bg-gray-700 text-left">
                    <tr>
                        <th className="px-8 py-3 text-left w-1/4">Jogador</th>
                        <th className="px-6 py-3 text-center w-1/4">Matrícula</th>
                        <th className="px-6 py-3 text-center w-1/4">Horas</th>
                        <th className="px-6 py-3 text-center w-1/6">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedPlayers.map((player) => {
                        const playerInitial = player.name.charAt(0).toUpperCase();
                        return (
                            <tr key={player.id} className="border-b border-gray-700">
                                <td className="px-6 py-4 text-left flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center mr-4">
                                        {playerInitial}
                                    </div>
                                    {player.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {player.registrationNumber}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {player.horas} {player.horas === 1 ? 'hora' : 'horas'}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => editPlayer(player)}
                                        className="text-green-500 mr-4"
                                        title="Editar"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(player)}
                                        className="text-red-500"
                                        title="Excluir"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <DeleteModal
                isOpen={isModalOpen}
                closeModal={() => {
                    setIsModalOpen(false);
                    setPlayerToDelete(null);
                }}
                onDelete={handleDelete}
                itemId={playerToDelete?.id || 0}
                itemName={playerToDelete?.name || ''}
                itemType="jogador"
            />
        </div>
    );
};

export default PlayerTable;
