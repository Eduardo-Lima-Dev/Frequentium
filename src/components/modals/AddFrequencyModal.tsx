import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { findAllGames } from '../../services/api/gameService';
import { findAllPlayers } from '../../services/api/playerService';
import { createFrequency, findAllFrequencies } from '../../services/api/frequencyService';
import { Game } from '../../types/Game';
import { Player } from '../../types/Player';
import toast from 'react-hot-toast';

interface AddFrequencyModalProps {
    isOpen: boolean;
    closeModal: () => void;
    onSuccess: () => Promise<void>;
}

const AddFrequencyModal: React.FC<AddFrequencyModalProps> = ({
    isOpen,
    closeModal,
    onSuccess
}) => {
    const [games, setGames] = useState<Game[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedGameId, setSelectedGameId] = useState<number | ''>('');
    const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [frequencies, setFrequencies] = useState<{ jogoId: number; jogadorId: number }[]>([]);

    const updateSelectedPlayers = (gameId: number, frequenciesData: { jogoId: number; jogadorId: number }[]) => {
        const playersWithFrequency = frequenciesData
            .filter(freq => freq.jogoId === gameId)
            .map(freq => freq.jogadorId);
        console.log('Jogadores com frequência:', playersWithFrequency);
        setSelectedPlayers(playersWithFrequency);
    };

    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                setIsLoadingData(true);
                try {
                    const [gamesData, playersData, frequenciesData] = await Promise.all([
                        findAllGames(),
                        findAllPlayers(),
                        findAllFrequencies()
                    ]);

                    const sortedGames = [...gamesData].sort((a, b) => {
                        return new Date(b.data).getTime() - new Date(a.data).getTime();
                    });

                    setGames(sortedGames);
                    setFrequencies(frequenciesData);

                    if (sortedGames.length > 0) {
                        const mostRecentGameId = sortedGames[0].id;
                        setSelectedGameId(mostRecentGameId);
                        updateSelectedPlayers(mostRecentGameId, frequenciesData);
                    }

                    const sortedPlayers = [...playersData].sort((a, b) => 
                        a.name.localeCompare(b.name, 'pt-BR')
                    );
                    setPlayers(sortedPlayers);
                } catch (error) {
                    console.error('Erro ao carregar dados:', error);
                    toast.error('Erro ao carregar dados');
                } finally {
                    setIsLoadingData(false);
                }
            };
            fetchData();
        }
    }, [isOpen]);

    const handleGameChange = (gameId: number) => {
        console.log('Jogo selecionado:', gameId);
        setSelectedGameId(gameId);
        updateSelectedPlayers(gameId, frequencies);
    };

    const handlePlayerToggle = (playerId: number) => {
        setSelectedPlayers(prev => 
            prev.includes(playerId) 
                ? prev.filter(id => id !== playerId)
                : [...prev, playerId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedGameId || selectedPlayers.length === 0) {
            toast.error('Selecione um jogo e pelo menos um jogador');
            return;
        }

        setLoading(true);
        try {
            const promises = selectedPlayers.map(playerId =>
                createFrequency(selectedGameId, playerId)
            );
            await Promise.all(promises);
            await onSuccess();
            closeModal();
            setSelectedPlayers([]);
            toast.success('Frequência registrada com sucesso!');
        } catch (error) {
            console.error('Erro ao registrar frequência:', error);
            toast.error('Erro ao registrar frequência');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <FaTimes />
                </button>
                <h2 className="text-2xl mb-4">Registrar Frequência</h2>
                <form onSubmit={handleSubmit} className="flex flex-col items-center"> 
                    <div className="mb-6 w-full"> 
                        <label className="block text-sm font-medium mb-2">
                            Data do Jogo
                        </label>
                        <select
                            value={selectedGameId}
                            onChange={(e) => handleGameChange(Number(e.target.value))}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            required
                        >
                            {games.map((game) => {
                                const date = new Date(game.data);
                                const formattedDate = date.toLocaleDateString('pt-BR');
                                return (
                                    <option key={game.id} value={game.id}>
                                        {formattedDate}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto mb-6 w-full">
                        <div className="text-gray-400 mb-2 text-center">
                            Jogadores selecionados: {selectedPlayers.length} de {players.length}
                        </div>
                        <div className="space-y-2">
                            {isLoadingData ? (
                                <div className="flex justify-center items-center h-32">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                                    <span className="ml-3 text-gray-400">Carregando jogadores...</span>
                                </div>
                            ) : (
                                players.map((player) => (
                                    <div key={player.id} className="flex items-center gap-2 p-2 bg-gray-700 rounded">
                                        <input
                                            type="checkbox"
                                            id={`player-${player.id}`}
                                            checked={selectedPlayers.includes(player.id)}
                                            onChange={() => handlePlayerToggle(player.id)}
                                            className="rounded text-blue-500 focus:ring-blue-500"
                                        />
                                        <label 
                                            htmlFor={`player-${player.id}`} 
                                            className="text-white flex-grow text-center" // Adicionado text-center
                                        >
                                            {player.name} - {player.registrationNumber}
                                        </label>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 w-full"> {/* Adicionado w-full */}
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 rounded hover:bg-green-600"
                            disabled={loading || isLoadingData}
                        >
                            {loading ? 'Processando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddFrequencyModal;