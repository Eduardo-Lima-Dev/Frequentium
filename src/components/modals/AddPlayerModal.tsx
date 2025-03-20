import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { createPlayer, updatePlayer } from '../services/api/playerService';
import toast from 'react-hot-toast';
import { Player } from '../types/Player';

interface AddPlayerModalProps {
    isOpen: boolean;
    closeModal: () => void;
    editingPlayer: Player | null;
    onSuccess: () => Promise<void>;
}

const AddPlayerModal: React.FC<AddPlayerModalProps> = ({
    isOpen,
    closeModal,
    editingPlayer,
    onSuccess
}) => {
    const [name, setName] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (editingPlayer) {
                setName(editingPlayer.name);
                setRegistrationNumber(editingPlayer.registrationNumber);
            } else {
                setName('');
                setRegistrationNumber('');
            }
        }
    }, [isOpen, editingPlayer]);

    const handleClose = () => {
        setName('');
        setRegistrationNumber('');
        closeModal();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingPlayer) {
                const updatedPlayer = await updatePlayer(editingPlayer.id, name, registrationNumber, editingPlayer.horas);
                if (!updatedPlayer) throw new Error('Erro ao atualizar jogador');
            } else {
                const newPlayer = await createPlayer(name, registrationNumber);
                if (!newPlayer) throw new Error('Erro ao criar jogador');
            }

            await onSuccess();
            handleClose();
            toast.success(editingPlayer ? 'Jogador atualizado com sucesso!' : 'Jogador adicionado com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar jogador', error);
            toast.error('Erro ao salvar jogador. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <FaTimes />
                </button>
                <h2 className="text-2xl mb-4">
                    {editingPlayer ? 'Editar Jogador' : 'Adicionar Novo Jogador'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Nome
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Matrícula
                        </label>
                        <input
                            type="text"
                            value={registrationNumber}
                            onChange={(e) => setRegistrationNumber(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={handleClose}
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
                            {loading ? 'Processando...' : (editingPlayer ? 'Atualizar' : 'Adicionar')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPlayerModal;