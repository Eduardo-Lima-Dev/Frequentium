import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { Player } from '../types/Player';

interface DeletePlayerModalProps {
    isOpen: boolean;
    closeModal: () => void;
    playerToDelete: Player | null;
    onDelete: (id: number) => void;
}

const DeletePlayerModal: React.FC<DeletePlayerModalProps> = ({
    isOpen,
    closeModal,
    playerToDelete,
    onDelete
}) => {
    if (!isOpen || !playerToDelete) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <FaTimes />
                </button>
                <h2 className="text-2xl mb-4">Confirmar Exclusão</h2>
                <p className="text-gray-300 mb-6">
                    Tem certeza que deseja excluir o jogador <span className="font-semibold">{playerToDelete.name}</span>?
                    Esta ação não pode ser desfeita.
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={closeModal}
                        className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => onDelete(playerToDelete.id)}
                        className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
                    >
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeletePlayerModal;
