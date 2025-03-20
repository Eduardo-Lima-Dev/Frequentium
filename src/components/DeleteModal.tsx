import React from 'react';

interface DeleteModalProps {
    isOpen: boolean;
    closeModal: () => void;
    onDelete: (id: number) => void;
    itemId: number;
    itemName: string;
    itemType: 'jogador' | 'jogo';
}

const DeleteModal: React.FC<DeleteModalProps> = ({
    isOpen,
    closeModal,
    onDelete,
    itemId,
    itemName,
    itemType,
}) => {
    if (!isOpen) return null;

    const handleDelete = () => {
        onDelete(itemId);
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
                        Tem certeza que deseja excluir o {itemType}?
                    </h3>
                    <p className="text-white font-bold text-lg mb-6">
                        {itemType === 'jogador' ? `Nome: ${itemName}` : `Data: ${itemName}`}
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

export default DeleteModal; 