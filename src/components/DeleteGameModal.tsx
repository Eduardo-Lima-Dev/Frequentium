import React from 'react';
import { Game } from '../types/Game';

interface DeleteGameModalProps {
    isOpen: boolean;
    closeModal: () => void;
    gameToDelete: Game | null;
    onDelete: (id: number) => void;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
};

const DeleteGameModal: React.FC<DeleteGameModalProps> = ({
    isOpen,
    closeModal,
    gameToDelete,
    onDelete,
}) => {
    if (!isOpen || !gameToDelete) return null;

    const handleDelete = () => {
        onDelete(gameToDelete.id);
        closeModal();
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-800 p-8 rounded-lg w-1/3 relative">
                <div className="text-center">
                    <div className="mb-6">
                        <span className="text-red-500 text-3xl font-semibold">
                            ⚠️
                        </span>
                    </div>
                    <h3 className="text-xl text-white mb-4">
                        Tem certeza que deseja excluir o jogo?
                    </h3>
                    <p className="text-white font-bold text-lg mb-6">
                        Data: {formatDate(gameToDelete.data)}
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleDelete}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            Sim, Excluir!
                        </button>
                        <button
                            onClick={closeModal}
                            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                            Não, Manter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteGameModal; 