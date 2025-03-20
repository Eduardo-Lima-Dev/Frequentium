import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Game } from '../types/Game';

interface AddGameModalProps {
    isOpen: boolean;
    closeModal: () => void;
    addGame: (data: string, duracao: number) => void;
    editingGame: Game | null;
    updateGame: (id: number, data: string, duracao: number) => void;
}

const AddGameModal: React.FC<AddGameModalProps> = ({
    isOpen,
    closeModal,
    addGame,
    updateGame,
    editingGame,
}) => {
    const [data, setData] = useState('');
    const [duracao, setDuracao] = useState(90);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editingGame) {
            const date = new Date(editingGame.data);
            const formattedDate = date.toISOString().split('T')[0];
            setData(formattedDate);
            setDuracao(editingGame.duracao);
        } else {
            setData('');
            setDuracao(90);
        }
    }, [editingGame]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            if (editingGame) {
                await updateGame(editingGame.id, data, duracao);
            } else {
                await addGame(data, duracao);
            }
            closeModal();
        } catch (error) {
            console.error('Erro ao salvar jogo:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <FaTimes />
                </button>
                <h2 className="text-2xl mb-4">
                    {editingGame ? 'Editar Jogo' : 'Adicionar Novo Jogo'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Data do Jogo
                        </label>
                        <input
                            type="date"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Duração (minutos)
                        </label>
                        <input
                            type="number"
                            value={duracao}
                            onChange={(e) => setDuracao(Number(e.target.value))}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            min="30"
                            max="180"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-4">
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
                            disabled={loading}
                        >
                            {loading ? 'Processando...' : (editingGame ? 'Atualizar' : 'Adicionar')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddGameModal;
