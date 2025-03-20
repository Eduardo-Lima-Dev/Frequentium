import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Game } from '../../types/Game';

interface AddGameModalProps {
    isOpen: boolean;
    closeModal: () => void;
    addGame: (data: string, duracao: number) => Promise<void>;
    editingGame: Game | null;
    updateGame: (id: number, data: string, duracao: number) => Promise<void>;
}

const AddGameModal: React.FC<AddGameModalProps> = ({
    isOpen,
    closeModal,
    addGame,
    editingGame,
    updateGame
}) => {
    const [data, setData] = useState('');
    const [duracao, setDuracao] = useState('1');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editingGame) {
            // Formatar a data para o formato YYYY-MM-DD
            const gameDate = new Date(editingGame.data);
            const formattedDate = gameDate.toISOString().split('T')[0];
            setData(formattedDate);
            setDuracao(editingGame.duracao.toString());
        } else {
            setData('');
            setDuracao('1');
        }
    }, [editingGame]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        console.log('Dados do formulário:', { data, duracao });
        
        if (!data || !duracao) {
            toast.error('Por favor, preencha todos os campos');
            return;
        }

        setLoading(true);
        try {
            if (editingGame) {
                await updateGame(editingGame.id, data, Number(duracao));
            } else {
                await addGame(data, Number(duracao));
            }
            setData('');
            setDuracao('1');
            closeModal();
        } catch (error) {
            console.error('Erro ao salvar jogo:', error);
            toast.error('Erro ao salvar jogo');
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
                            Duração (horas)
                        </label>
                        <select
                            value={duracao}
                            onChange={(e) => setDuracao(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            required
                        >
                            <option value="1">1 hora</option>
                            <option value="2">2 horas</option>
                            <option value="3">3 horas</option>
                        </select>
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
                            {loading ? 'Processando...' : editingGame ? 'Atualizar' : 'Adicionar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddGameModal;
