import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { findAllPlayers } from '../../services/api/playerService';
import { findAllFrequencies } from '../../services/api/frequencyService';
import toast from 'react-hot-toast';

interface ViewFrequencyModalProps {
    isOpen: boolean;
    closeModal: () => void;
    gameId: number;
    gameDate: string;
}

interface FrequencyWithPlayer {
    id: number;
    playerName: string;
    playerRegistration: string;
}

const ViewFrequencyModal: React.FC<ViewFrequencyModalProps> = ({
    isOpen,
    closeModal,
    gameId,
    gameDate
}) => {
    const [frequencies, setFrequencies] = useState<FrequencyWithPlayer[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchFrequencies = async () => {
                setLoading(true);
                try {
                    const [frequenciesData, playersData] = await Promise.all([
                        findAllFrequencies(),
                        findAllPlayers()
                    ]);

                    const gameFrequencies = frequenciesData
                        .filter(freq => freq.jogoId === gameId)
                        .map(freq => {
                            const player = playersData.find(p => p.id === freq.jogadorId);
                            if (!player) return null;
                            return {
                                id: freq.id,
                                playerName: player.name,
                                playerRegistration: player.registrationNumber
                            };
                        })
                        .filter((freq): freq is FrequencyWithPlayer => freq !== null)
                        .sort((a, b) => a.playerName.localeCompare(b.playerName, 'pt-BR'));

                    setFrequencies(gameFrequencies);
                } catch (error) {
                    console.error('Erro ao carregar frequências:', error);
                    toast.error('Erro ao carregar frequências');
                } finally {
                    setLoading(false);
                }
            };

            fetchFrequencies();
        }
    }, [isOpen, gameId]);

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
                <h2 className="text-2xl mb-4">Frequência do Jogo</h2>
                <p className="text-gray-400 mb-6">
                    Data: {new Date(gameDate).toLocaleDateString('pt-BR')}
                </p>

                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                        <span className="ml-3 text-gray-400">Carregando frequências...</span>
                    </div>
                ) : frequencies.length > 0 ? (
                    <div className="space-y-2">
                        <div className="text-gray-400 mb-2">
                            Total de jogadores presentes: {frequencies.length}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {frequencies.map((freq) => (
                                <div key={freq.id} className="flex items-center gap-2 p-2 bg-gray-700 rounded">
                                    <span className="text-white">
                                        {freq.playerName} - {freq.playerRegistration}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-400 text-center">Nenhuma frequência registrada para este jogo.</p>
                )}
            </div>
        </div>
    );
};

export default ViewFrequencyModal; 