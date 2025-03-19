import React, { useState } from 'react';
import Header from '../components/Header';
import PlayerTable from '../components/PlayerTable';
import AddPlayerModal from '../components/AddPlayerModal';
import UploadJsonModal from '../components/UploadJsonModal';
import Pagination from '../components/Pagination';

const Dashboard: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [players, setPlayers] = useState<any[]>([
        { id: 1, name: 'Lucas Silva', registrationNumber: '123456', date: 'Jan 1, 2022' },
        { id: 2, name: 'Maria Oliveira', registrationNumber: '123457', date: 'Jan 2, 2022' },
        { id: 3, name: 'Carlos Souza', registrationNumber: '123458', date: 'Jan 3, 2022' },
        { id: 4, name: 'Fernanda Costa', registrationNumber: '123459', date: 'Jan 4, 2022' },
        { id: 5, name: 'Paulo Santos', registrationNumber: '123460', date: 'Jan 5, 2022' },
        { id: 6, name: 'Ana Rodrigues', registrationNumber: '123461', date: 'Jan 6, 2022' },
        { id: 7, name: 'João Pereira', registrationNumber: '123462', date: 'Jan 7, 2022' },
        { id: 8, name: 'Rita Lima', registrationNumber: '123463', date: 'Jan 8, 2022' },
        { id: 9, name: 'Juliana Almeida', registrationNumber: '123464', date: 'Jan 9, 2022' },
        { id: 10, name: 'Eduardo Costa', registrationNumber: '123465', date: 'Jan 10, 2022' },
        { id: 11, name: 'Gabriela Rocha', registrationNumber: '123466', date: 'Jan 11, 2022' },
        { id: 12, name: 'Ricardo Lima', registrationNumber: '123467', date: 'Jan 12, 2022' },
        { id: 13, name: 'Daniela Pereira', registrationNumber: '123468', date: 'Jan 13, 2022' },
        { id: 14, name: 'Felipe Martins', registrationNumber: '123469', date: 'Jan 14, 2022' },
        { id: 15, name: 'Mariana Souza', registrationNumber: '123470', date: 'Jan 15, 2022' },
    ]);
    const [currentPage, setCurrentPage] = useState(1);
    const playersPerPage = 10;
    const [editingPlayer, setEditingPlayer] = useState<any | null>(null); 

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const openUploadModal = () => setIsUploadModalOpen(true);
    const closeUploadModal = () => setIsUploadModalOpen(false);

    const addPlayer = (name: string, registrationNumber: string, date: string) => {
        const newPlayer = {
            id: players.length + 1,
            name,
            registrationNumber,
            date,
        };
        setPlayers([...players, newPlayer]);
    };

    const handleFileUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result as string);
                console.log('Arquivo JSON carregado:', data);
            } catch (error) {
                console.error('Erro ao processar o arquivo JSON', error);
            }
        };
        reader.readAsText(file);
    };

    const editPlayer = (player: any) => {
        setEditingPlayer(player);  
        openModal();  
    };

    const indexOfLastPlayer = currentPage * playersPerPage;
    const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
    const currentPlayers = players.slice(indexOfFirstPlayer, indexOfLastPlayer);

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <Header />
            <div className="p-6 text-center">
                <h1 className="text-4xl mb-4">Frequências Meu Racha</h1>
                <h2 className="text-lg text-gray-400 mt-2 mb-6">Os alunos que jogaram no racha</h2>

                <div className="flex flex-wrap justify-center gap-4 mb-6">
                    <button
                        onClick={openModal}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                        Adicionar Novo Aluno
                    </button>
                    <button
                        onClick={openUploadModal}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        Importar JSON
                    </button>
                </div>

                <PlayerTable 
                    players={currentPlayers} 
                    editPlayer={editPlayer} 
                />

                <Pagination
                    totalPlayers={players.length}
                    playersPerPage={playersPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>

            <AddPlayerModal
                isOpen={isModalOpen}
                closeModal={closeModal}
                addPlayer={addPlayer}
                editingPlayer={editingPlayer}  
            />
            <UploadJsonModal
                isOpen={isUploadModalOpen}
                closeModal={closeUploadModal}
                handleFileUpload={handleFileUpload}
            />
        </div>
    );
};

export default Dashboard;
