import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { findAllGames, createGame, updateGame, deleteGame } from '../services/api/gameService';
import { findFrequenciesByGameId } from '../services/api/frequencyService';
import GameTable from '../components/GameTable';
import AddGameModal from '../components/modals/AddGameModal';
import AddFrequencyModal from '../components/modals/AddFrequencyModal';
import DeleteModal from '../components/modals/DeleteModal';
import Pagination from '../components/Pagination';
import Header from '../components/Header';
import toast, { Toaster } from 'react-hot-toast';
import { Game } from '../types/Game';
import { FaArrowLeft, FaPlus, FaClipboardCheck } from 'react-icons/fa';

const GameDashboard: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFrequencyModalOpen, setIsFrequencyModalOpen] = useState(false);
    const [games, setGames] = useState<Game[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const gamesPerPage = 10;
    const [isLoading, setIsLoading] = useState(false);
    const [editingGame, setEditingGame] = useState<Game | null>(null);
    const [gameToDelete, setGameToDelete] = useState<Game | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingGame(null);
    };

    const openFrequencyModal = () => setIsFrequencyModalOpen(true);
    const closeFrequencyModal = () => setIsFrequencyModalOpen(false);

    const fetchGames = async () => {
        setIsLoading(true);
        try {
            const data = await findAllGames();
            const formattedGames = data.map(game => ({
                id: game.id,
                data: game.data,
                duracao: game.duracao,
            }));
            setGames(formattedGames);
        } catch (error) {
            console.error('Erro ao buscar jogos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const addGame = async (data: string, duracao: number) => {
        try {
            const newGame = await createGame(data, duracao);
            if (newGame) {
                await fetchGames();
                closeModal();
                toast.success('Jogo adicionado com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao adicionar jogo', error);
            toast.error('Erro ao adicionar jogo');
        }
    };

    const editGame = (game: Game) => {
        setEditingGame(game);
        openModal();
    };

    const updateGameDetails = async (id: number, data: string, duracao: number) => {
        try {
            const updatedGame = await updateGame(id, data, duracao);
            if (updatedGame) {
                await fetchGames();
                closeModal();
            }
        } catch (error) {
            console.error('Erro ao atualizar jogo', error);
            toast.error('Erro ao atualizar jogo');
        }
    };

    const handleDeleteClick = (game: Game) => {
        setGameToDelete(game);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        try {
            const frequencies = await findFrequenciesByGameId(id);
            const hasFrequencies = frequencies && frequencies.length > 0;

            if (hasFrequencies) {
                toast.error('Não é possível excluir este jogo pois existem frequências vinculadas a ele.');
                setIsDeleteModalOpen(false);
                setGameToDelete(null);
                return;
            }

            await deleteGame(id);
            await fetchGames();
            setIsDeleteModalOpen(false);
            setGameToDelete(null);
            toast.success('Jogo excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir jogo:', error);
            toast.error('Erro ao excluir jogo');
        }
    };

    useEffect(() => {
        fetchGames();
    }, []);

    const indexOfLastGame = currentPage * gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;
    const currentGames = games.slice(indexOfFirstGame, indexOfLastGame);

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <Toaster position="top-right" />
            <Header />
            <div className="p-6 text-center">
                <div className="flex items-center justify-between mb-6">
                    <Link
                        to="/"
                        className="px-4 py-2 text-gray-400 hover:text-white transition flex items-center gap-2"
                    >
                        <FaArrowLeft />
                        Voltar
                    </Link>
                    <h1 className="text-4xl">Gerenciamento de Jogos</h1>
                    <div className="w-24"></div>
                </div>
                <h2 className="text-lg text-gray-400 mt-2 mb-6">Os jogos cadastrados no sistema</h2>

                <div className="flex flex-wrap justify-center gap-4 mb-6">
                    <button
                        onClick={openModal}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                    >
                        <FaPlus />
                        Adicionar Novo Jogo
                    </button>
                    <button
                        onClick={openFrequencyModal}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
                    >
                        <FaClipboardCheck />
                        Adicionar Frequência
                    </button>
                </div>

                <GameTable
                    games={currentGames}
                    editGame={editGame}
                    handleDeleteClick={handleDeleteClick}
                    isLoading={isLoading}
                    onFrequencyUpdate={async () => {
                        await fetchGames();
                        const event = new CustomEvent('updatePlayers');
                        window.dispatchEvent(event);
                    }}
                />

                <Pagination
                    totalItems={games.length}
                    itemsPerPage={gamesPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>

            <AddGameModal
                isOpen={isModalOpen}
                closeModal={closeModal}
                addGame={addGame}
                editingGame={editingGame}
                updateGame={updateGameDetails}
            />
            <AddFrequencyModal
                isOpen={isFrequencyModalOpen}
                closeModal={closeFrequencyModal}
                onSuccess={fetchGames}
            />
            <DeleteModal
                isOpen={isDeleteModalOpen}
                closeModal={() => {
                    setIsDeleteModalOpen(false);
                    setGameToDelete(null);
                }}
                onDelete={handleDelete}
                itemId={gameToDelete?.id || 0}
                itemName={gameToDelete ? new Date(gameToDelete.data).toLocaleDateString('pt-BR') : ''}
                itemType="jogo"
            />
        </div>
    );
};

export default GameDashboard;
