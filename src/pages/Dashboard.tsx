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
        horas: number;  // Adicionando o campo horas, conforme o backend
    }

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const openUploadModal = () => setIsUploadModalOpen(true);
    const closeUploadModal = () => setIsUploadModalOpen(false);

    const addPlayer = (name: string, registrationNumber: string) => {
        const newPlayer = {
            id: players.length + 1,
            name,
            registrationNumber,
            horas: 0,  // Inicializando as horas como 0
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

    const editPlayer = (player: Player) => {
        setEditingPlayer(player);
        openModal();
    };

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const data = await findAllPlayers();
                console.log('Jogadores recebidos do backend:', data);
                // Mapeando os dados do backend para o formato esperado
                const formattedPlayers = data.map((player: { id: number; nome: string; matricula: string; horas?: number }) => ({
                    id: player.id,
                    name: player.nome,
                    registrationNumber: player.matricula,
                    horas: player.horas || 0,  // Garantir que horas tenha valor, caso contrário usa 0
                }));
                setPlayers(formattedPlayers);
            } catch (error) {
                console.error('Erro ao buscar jogadores:', error);
            }
        };

        fetchPlayers();
    }, []);

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
