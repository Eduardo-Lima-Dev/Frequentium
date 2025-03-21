import React, { useState } from 'react';
import { FaEdit, FaTrashAlt, FaClipboardList } from 'react-icons/fa';
import { Game } from '../types/Game';
import DeleteModal from './modals/DeleteModal';
import EditFrequencyModal from './modals/EditFrequencyModal';
import { createFrequency, findAllFrequencies, deleteFrequency } from '../services/api/frequencyService';
import toast from 'react-hot-toast';

interface GameTableProps {
    games: Game[];
    editGame: (game: Game) => void;
    handleDeleteClick: (game: Game) => void;
    isLoading: boolean;
    onFrequencyUpdate: () => Promise<void>;
}

const GameTable: React.FC<GameTableProps> = ({ games, editGame, handleDeleteClick, isLoading, onFrequencyUpdate }) => {
    const [gameToDelete, setGameToDelete] = useState<Game | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [isFrequencyModalOpen, setIsFrequencyModalOpen] = useState(false);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    };

    const openDeleteModal = async (game: Game) => {
        try {
            const frequencies = await findAllFrequencies();
            const hasFrequencies = frequencies.some(freq => freq.jogo_id === game.id);

            if (hasFrequencies) {
                toast.error('Não é possível excluir este jogo pois ele possui frequências registradas.');
                return;
            }

            setGameToDelete(game);
            setIsDeleteModalOpen(true);
        } catch (error) {
            console.error('Erro ao verificar frequências:', error);
            toast.error('Erro ao verificar frequências');
        }
    };

    const openFrequencyModal = (game: Game) => {
        setSelectedGame(game);
        setIsFrequencyModalOpen(true);
    };

    const sortedGames = [...games].sort((a, b) => {
        const dateA = new Date(a.data);
        const dateB = new Date(b.data);
        return dateB.getTime() - dateA.getTime();
    });

    const handleSaveFrequencies = async (selectedPlayers: number[]) => {
        try {
            if (!selectedGame) return;

            const allFrequencies = await findAllFrequencies();
            const gameFrequencies = allFrequencies.filter(freq => freq.jogo_id === selectedGame.id);
            const currentPlayerIds = gameFrequencies.map(freq => freq.jogador_id);

            const playersToRemove = currentPlayerIds.filter(id => !selectedPlayers.includes(id));
            const playersToAdd = selectedPlayers.filter(id => !currentPlayerIds.includes(id));

            const deletePromises = gameFrequencies
                .filter(freq => playersToRemove.includes(freq.jogador_id))
                .map(freq => {
                    console.log('Deletando frequência:', freq.id, 'do jogador:', freq.jogador_id);
                    return deleteFrequency(freq.id);
                });
            
            const createPromises = playersToAdd.map(playerId => {
                console.log('Criando frequência para jogador:', playerId);
                return createFrequency(selectedGame.id, playerId);
            });
            
            await Promise.all([...deletePromises, ...createPromises]);
            
            const event = new CustomEvent('updatePlayers');
            window.dispatchEvent(event);
            
            await onFrequencyUpdate();
            toast.success('Frequências atualizadas com sucesso!');
            
        } catch (error) {
            console.error('Erro ao atualizar frequências:', error);
            toast.error('Erro ao atualizar frequências');
            throw error;
        }
    };

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
                            <th className="px-6 py-4 text-center">Duração</th>
                            <th className="px-6 py-4 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedGames.map((game) => (
                            <tr key={game.id} className="border-b border-gray-700">
                                <td className="px-6 py-4 text-center">{formatDate(game.data)}</td>
                                <td className="px-6 py-4 text-center">{game.duracao} {game.duracao === 1 ? 'hora' : 'horas'}</td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => openFrequencyModal(game)}
                                        className="text-blue-500 mr-4"
                                        title="Ver Frequência"
                                    >
                                        <FaClipboardList />
                                    </button>
                                    <button
                                        onClick={() => editGame(game)}
                                        className="text-green-500 mr-4"
                                        title="Editar"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(game)}
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

            <DeleteModal
                isOpen={isDeleteModalOpen}
                closeModal={() => {
                    setIsDeleteModalOpen(false);
                    setGameToDelete(null);
                }}
                onDelete={(id) => handleDeleteClick({ ...gameToDelete!, id })}
                itemId={gameToDelete?.id || 0}
                itemName={gameToDelete ? formatDate(gameToDelete.data) : ''}
                itemType="jogo"
            />

            <EditFrequencyModal
                isOpen={isFrequencyModalOpen}
                closeModal={() => {
                    setIsFrequencyModalOpen(false);
                    setSelectedGame(null);
                }}
                gameId={selectedGame?.id || 0}
                gameDate={selectedGame?.data || ''}
                onSave={handleSaveFrequencies}
            />
        </div>
    );
};

export default GameTable;
