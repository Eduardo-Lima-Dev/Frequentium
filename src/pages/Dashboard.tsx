import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import PlayerTable from '../components/PlayerTable';
import AddPlayerModal from '../components/AddPlayerModal';
import UploadJsonModal from '../components/UploadJsonModal';
import Pagination from '../components/Pagination';
import { findAllPlayers, createManyPlayers } from '../services/api/playerService';
import toast, { Toaster } from 'react-hot-toast';
import { FaGamepad, FaFileUpload, FaPlus } from 'react-icons/fa';
import { Player } from '../types/Player';

const Dashboard: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [players, setPlayers] = useState<Player[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const playersPerPage = 10;
    const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPlayer(null);
    };

    const openUploadModal = () => setIsUploadModalOpen(true);
    const closeUploadModal = () => setIsUploadModalOpen(false);

    const handleFileUpload = async (file: File) => {
        setIsLoading(true);
        const reader = new FileReader();
        
        reader.onload = async () => {
            try {
                const fileContent = reader.result as string;
                console.log('Conteúdo do arquivo:', fileContent);
                
                const players = JSON.parse(fileContent);
                console.log('Dados do JSON parseados:', players);
                console.log('Quantidade de jogadores no JSON:', players.length);
                
                if (!Array.isArray(players)) {
                    toast.error('O arquivo JSON deve conter um array de jogadores');
                    return;
                }

                const isValidFormat = players.every(player => 
                    player.nome && 
                    (player.matricula || player.matricula === 0)
                );

                if (!isValidFormat) {
                    toast.error('Formato inválido. Cada jogador deve ter nome e matrícula');
                    return;
                }

                const result = await createManyPlayers(players);
                console.log('Resultado da criação em lote:', result);
                
                if (result) {
                    await fetchPlayers();
                    closeUploadModal();
                    toast.success(`${result.length} jogadores foram adicionados com sucesso!`);
                } else {
                    toast.error('Erro ao adicionar jogadores. Verifique o console para mais detalhes.');
                }
            } catch (error) {
                console.error('Erro ao processar o arquivo JSON ou criar jogadores:', error);
                toast.error('Erro ao processar o arquivo. Verifique se o formato está correto.');
            } finally {
                setIsLoading(false);
            }
        };

        reader.onerror = () => {
            console.error('Erro ao ler o arquivo');
            toast.error('Erro ao ler o arquivo');
            setIsLoading(false);
        };

        reader.readAsText(file);
    };

    const editPlayer = (player: Player) => {
        setEditingPlayer(player);
        openModal();
    };

    const fetchPlayers = async () => {
        setIsLoading(true);
        try {
            const data = await findAllPlayers();
            console.log('Jogadores recebidos do backend:', data);
            setPlayers(data);
        } catch (error) {
            console.error('Erro ao buscar jogadores:', error);
            toast.error('Erro ao carregar jogadores');
        } finally {
            setIsLoading(false);
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
            <Toaster position="top-right" />
            <Header />
            <div className="p-6 text-center">
                <h1 className="text-4xl mb-4">Frequências Meu Racha</h1>
                <h2 className="text-lg text-gray-400 mt-2 mb-6">Os jogadores que participaram do racha</h2>

                <div className="flex flex-wrap justify-center gap-4 mb-6">
                    <button
                        onClick={openModal}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                    >
                        <FaPlus />
                        Adicionar Novo Jogador
                    </button>
                    <button
                        onClick={openUploadModal}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
                    >
                        <FaFileUpload />
                        Importar JSON
                    </button>
                    <Link
                        to="/jogos"
                        className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center gap-2"
                    >
                        <FaGamepad />
                        Gerenciar Jogos
                    </Link>
                </div>

                <PlayerTable 
                    players={currentPlayers} 
                    editPlayer={editPlayer} 
                    setPlayers={setPlayers}
                    isLoading={isLoading}
                />

                <Pagination
                    totalItems={players.length}
                    itemsPerPage={playersPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>

            <AddPlayerModal
                isOpen={isModalOpen}
                closeModal={closeModal}
                editingPlayer={editingPlayer}
                onSuccess={async () => {
                    try {
                        await fetchPlayers();
                    } catch (error) {
                        console.error('Erro ao atualizar lista de jogadores:', error);
                        toast.error('Erro ao atualizar lista de jogadores');
                    }
                }}
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
