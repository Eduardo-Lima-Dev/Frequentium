import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

interface AddPlayerModalProps {
    isOpen: boolean;
    closeModal: () => void;
    addPlayer: (registrationNumber: string, name: string) => void; // Modificado para refletir a estrutura do backend
    editingPlayer: { name: string; registrationNumber: string } | null; 
}

const AddPlayerModal: React.FC<AddPlayerModalProps> = ({
    isOpen,
    closeModal,
    addPlayer,
    editingPlayer,
}) => {
    const [name, setName] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');

    useEffect(() => {
        if (editingPlayer) {
            setName(editingPlayer.name);
            setRegistrationNumber(editingPlayer.registrationNumber);
        }
    }, [editingPlayer]);  

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // No backend, o campo `horas` sempre começa com 0, então não precisa ser enviado
        addPlayer(registrationNumber, name); // Chamando a função `addPlayer` sem `horas`
        closeModal(); 
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded-lg w-1/2 relative">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl text-white">Adicionar Novo Aluno</h2>
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
                        >
                            {editingPlayer ? 'Atualizar' : 'Adicionar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPlayerModal;
