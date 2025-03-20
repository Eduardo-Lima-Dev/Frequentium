import axios from 'axios';

const API_URL = 'http://localhost:3000/';

export interface Game {
    id: number;
    data: string;
    duracao: number;
}

export const findAllGames = async () => {
    try {
        console.log('Buscando todos os jogos');
        const response = await axios.get(`${API_URL}jogos`);
        console.log('Jogos encontrados:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar os jogos', error);
        return [];
    }
};

export const findGameById = async (id: number) => {
    try {
        console.log(`Buscando jogo com ID ${id}`);
        const response = await axios.get(`${API_URL}jogos/${id}`);
        console.log('Jogo encontrado:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar o jogo com ID ${id}`, error);
        return null;
    }
};

export const createGame = async (data: string, duracao: number) => {
    try {
        console.log('Criando novo jogo');
        const response = await axios.post(`${API_URL}jogos`, { data, duracao });
        console.log('Jogo criado:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar o jogo', error);
        return null;
    }
};

export const updateGame = async (id: number, data: string, duracao: number) => {
    try {
        console.log(`Atualizando jogo com ID ${id}`);
        const response = await axios.put(`${API_URL}jogos/${id}`, { data, duracao });
        console.log('Jogo atualizado:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar o jogo com ID ${id}`, error);
        return null;
    }
};

export const deleteGame = async (id: number) => {
    try {
        console.log(`Excluindo jogo com ID ${id}`);
        const response = await axios.delete(`${API_URL}jogos/${id}`);
        console.log('Jogo excluído com sucesso');
        return response.data;
    } catch (error) {
        console.error(`Erro ao excluir o jogo com ID ${id}`, error);
        return null;
    }
};
