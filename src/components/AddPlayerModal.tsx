import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { createPlayer, updatePlayer } from '../services/api/playerService'; 

interface Player {
    id: number;
    name: string;
    registrationNumber: string;
    horas: number;
}

interface AddPlayerModalProps {
    isOpen: boolean;
    closeModal: () => void;
    editingPlayer: Player | null;
    addPlayer: (name: string, registrationNumber: string) => void;
    setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
}

const AddPlayerModal: React.FC<AddPlayerModalProps> = ({
    isOpen,
    closeModal,
    editingPlayer,
    setPlayers,
}) => {
    const [name, setName] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        if (editingPlayer) {
            setName(editingPlayer.name);
            setRegistrationNumber(editingPlayer.registrationNumber);
        }
    }, [editingPlayer]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); 

        try {
            let updatedPlayer: Player;
            if (editingPlayer) {
                updatedPlayer = await updatePlayer(editingPlayer.id, name, registrationNumber, editingPlayer.horas);
                setPlayers(prevPlayers => 
                    prevPlayers.map(player => player.id === updatedPlayer.id ? updatedPlayer : player)
                );
            } else {
                updatedPlayer = await createPlayer(name, registrationNumber);
                setPlayers(prevPlayers => [...prevPlayers, updatedPlayer]);
            }
            console.log('Jogador salvo com sucesso', updatedPlayer);
            closeModal(); 
        } catch (error) {
            console.error('Erro ao salvar jogador', error);
        } finally {
            setLoading(false); 
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded-lg w-1/2 relative">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl text-white">{editingPlayer ? 'Editar Jogador' : 'Adicionar Novo Aluno'}</h2>
                    <button
                        onClick={closeModal}
                        className="text-white text-2xl ml-4"
                    >
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-white">Nome</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 mt-2 rounded-lg bg-gray-600 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-white">Matrícula</label>
                        <input
                            type="text"
                            value={registrationNumber}
                            onChange={(e) => setRegistrationNumber(e.target.value)}
                            className="w-full px-4 py-2 mt-2 rounded-lg bg-gray-600 text-white"
                            required
                        />
                    </div>
                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            disabled={loading} 
                        >
                            {loading ? 'Processando...' : (editingPlayer ? 'Atualizar' : 'Adicionar')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPlayerModal;
