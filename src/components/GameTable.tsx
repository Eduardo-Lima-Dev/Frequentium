import React, { useState } from 'react';
import { FaEdit, FaTrashAlt, FaClipboardList } from 'react-icons/fa';
import { Game } from '../types/Game';
import DeleteModal from './modals/DeleteModal';
import EditFrequencyModal from './modals/EditFrequencyModal';
import { createFrequency, findAllFrequencies, deleteFrequency } from '../services/api/frequencyService';
import { findPlayersByGameId } from '../services/api/playerService';
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

    const openDeleteModal = (game: Game) => {
        setGameToDelete(game);
        setIsDeleteModalOpen(true);
    };

    const openFrequencyModal = (game: Game) => {
        setSelectedGame(game);
        setIsFrequencyModalOpen(true);
    };

    // Ordenar os jogos por data (do mais recente para o mais antigo)
    const sortedGames = [...games].sort((a, b) => {
        const dateA = new Date(a.data);
        const dateB = new Date(b.data);
        return dateB.getTime() - dateA.getTime();
    });

    const handleSaveFrequencies = async (selectedPlayers: number[]) => {
        try {
            if (!selectedGame) return;
            
            console.log('Jogo selecionado:', selectedGame.id);
            console.log('Jogadores selecionados:', selectedPlayers);
            
            // Buscar frequências existentes do jogo
            const allFrequencies = await findAllFrequencies();
            const gameFrequencies = allFrequencies.filter(freq => freq.jogoId === selectedGame.id);
            const currentPlayerIds = gameFrequencies.map(freq => freq.jogadorId);
            
            console.log('Frequências existentes:', gameFrequencies);
            console.log('IDs dos jogadores atuais:', currentPlayerIds);
            
            // Identificar jogadores a serem removidos e adicionados
            const playersToRemove = currentPlayerIds.filter(id => !selectedPlayers.includes(id));
            const playersToAdd = selectedPlayers.filter(id => !currentPlayerIds.includes(id));
            
            console.log('Jogadores a serem removidos:', playersToRemove);
            console.log('Jogadores a serem adicionados:', playersToAdd);
            
            // Remover frequências dos jogadores desmarcados
            const deletePromises = gameFrequencies
                .filter(freq => playersToRemove.includes(freq.jogadorId))
                .map(freq => {
                    console.log('Deletando frequência:', freq.id, 'do jogador:', freq.jogadorId);
                    return deleteFrequency(freq.id);
                });
            
            // Adicionar frequências para novos jogadores selecionados
            const createPromises = playersToAdd.map(playerId => {
                console.log('Criando frequência para jogador:', playerId);
                return createFrequency(selectedGame.id, playerId);
            });
            
            // Executar todas as operações
            await Promise.all([...deletePromises, ...createPromises]);
            
            // Atualizar a lista de jogadores na Dashboard
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
