import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { findAllPlayers } from '../../services/api/playerService';
import { findAllFrequencies } from '../../services/api/frequencyService';
import toast from 'react-hot-toast';
import { Player } from '../../types/Player';

interface EditFrequencyModalProps {
    isOpen: boolean;
    closeModal: () => void;
    gameId: number;
    gameDate: string;
    onSave: (selectedPlayers: number[]) => Promise<void>;
}

const EditFrequencyModal: React.FC<EditFrequencyModalProps> = ({
    isOpen,
    closeModal,
    gameId,
    gameDate,
    onSave
}) => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    console.log('Buscando dados para o jogo:', gameId);
                    // Buscar todos os jogadores e frequências
                    const [allPlayers, frequencies] = await Promise.all([
                        findAllPlayers(),
                        findAllFrequencies()
                    ]);

                    // Filtrar frequências apenas do jogo atual
                    const gameFrequencies = frequencies.filter(freq => freq.jogoId === gameId);
                    
                    // Pegar os IDs dos jogadores que têm frequência neste jogo
                    const playerIdsWithFrequency = gameFrequencies.map(freq => freq.jogadorId);

                    console.log('Jogadores do jogo:', gameFrequencies);
                    console.log('Todos os jogadores:', allPlayers);

                    // Ordenar jogadores por nome
                    const sortedPlayers = [...allPlayers].sort((a, b) => 
                        a.name.localeCompare(b.name, 'pt-BR')
                    );
                    setPlayers(sortedPlayers);

                    console.log('IDs dos jogadores com frequência:', playerIdsWithFrequency);
                    setSelectedPlayers(playerIdsWithFrequency);
                } catch (error) {
                    console.error('Erro ao carregar dados:', error);
                    toast.error('Erro ao carregar dados');
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [isOpen, gameId]);

    const handlePlayerToggle = (playerId: number) => {
        setSelectedPlayers(prev => 
            prev.includes(playerId)
                ? prev.filter(id => id !== playerId)
                : [...prev, playerId]
        );
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            // Envia todos os jogadores selecionados
            await onSave(selectedPlayers);
            toast.success('Frequências atualizadas com sucesso!');
            closeModal();
        } catch (error) {
            console.error('Erro ao salvar frequências:', error);
            toast.error('Erro ao salvar frequências');
        } finally {
            setIsSaving(false);
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
                <h2 className="text-2xl mb-4">Editar Frequência do Jogo</h2>
                <p className="text-gray-400 mb-6">
                    Data: {new Date(gameDate).toLocaleDateString('pt-BR')}
                </p>

                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                        <span className="ml-3 text-gray-400">Carregando jogadores...</span>
                    </div>
                ) : (
                    <>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto mb-6">
                            <div className="text-gray-400 mb-2">
                                Jogadores selecionados: {selectedPlayers.length} de {players.length}
                            </div>
                            <div className="space-y-2">
                                {players.map((player) => (
                                    <div key={player.id} className="flex items-center gap-2 p-2 bg-gray-700 rounded">
                                        <input
                                            type="checkbox"
                                            id={`player-${player.id}`}
                                            checked={selectedPlayers.includes(player.id)}
                                            onChange={() => handlePlayerToggle(player.id)}
                                            className="rounded text-blue-500 focus:ring-blue-500"
                                        />
                                        <label htmlFor={`player-${player.id}`} className="text-white flex-grow">
                                            {player.name} - {player.registrationNumber}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                                disabled={isSaving}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-green-500 rounded hover:bg-green-600"
                                disabled={isSaving}
                            >
                                {isSaving ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default EditFrequencyModal;