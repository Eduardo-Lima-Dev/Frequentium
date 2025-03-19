import axios from 'axios';

const API_URL = 'https://api.example.com/players';

interface Player {
    id: number;
    name: string;
    registrationNumber: string;
    date: string;
}

export const getPlayers = async (): Promise<Player[]> => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar jogadores:', error);
        return [];
    }
};

export const updatePlayer = async (id: number, updatedPlayer: Player) => {
    try {
        await axios.put(`${API_URL}/${id}`, updatedPlayer);
    } catch (error) {
        console.error('Erro ao atualizar jogador:', error);
    }
};

export const deletePlayer = async (id: number) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error('Erro ao excluir jogador:', error);
    }
};
