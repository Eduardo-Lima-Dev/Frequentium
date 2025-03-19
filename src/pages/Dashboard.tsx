import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import PlayerTable from '../components/PlayerTable';
import AddPlayerModal from '../components/AddPlayerModal';
import UploadJsonModal from '../components/UploadJsonModal';
import Pagination from '../components/Pagination';
import { findAllPlayers } from '../services/api/playerService';

const Dashboard: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [players, setPlayers] = useState<Player[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const playersPerPage = 10;
    const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

    interface Player {
        id: number;
        name: string;
        registrationNumber: string;
        horas: number; 
    }

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPlayer(null);
    };

    const openUploadModal = () => setIsUploadModalOpen(true);
    const closeUploadModal = () => setIsUploadModalOpen(false);

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

    const editPlayer = (player: Player) => {
        setEditingPlayer(player);
        openModal();
    };

    const fetchPlayers = async () => {
        try {
            const data = await findAllPlayers();
            console.log('Jogadores recebidos do backend:', data);
            const formattedPlayers = data.map((player: { id: number; nome: string; matricula: string; horas?: number }) => ({
                id: player.id,
                name: player.nome,
                registrationNumber: player.matricula,
                horas: player.horas || 0,
            }));
            setPlayers(formattedPlayers);
        } catch (error) {
            console.error('Erro ao buscar jogadores:', error);
        }
    };

    useEffect(() => {
        fetchPlayers();
    }, []);

    const indexOfLastPlayer = currentPage * playersPerPage;
    const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
    const currentPlayers = [...players]
        .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
        .slice(indexOfFirstPlayer, indexOfLastPlayer);

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
                    setPlayers={setPlayers}
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
                editingPlayer={editingPlayer}
                onSuccess={fetchPlayers}
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
