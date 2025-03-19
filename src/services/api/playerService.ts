import axios from 'axios';

const API_URL = 'http://localhost:3000/';

// Função para buscar todos os jogadores
export const findAllPlayers = async () => {
    try {
        console.log('Buscando os jogadores');
        const response = await axios.get(`${API_URL}jogadores`);
        console.log('Jogadores encontrados', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar os jogadores', error);
        return [];
    }
};

// Função para buscar um jogador pelo ID
export const findPlayerById = async (id: string | number) => {
    try {
        console.log(`Buscando o jogador com ID ${id}`);
        const response = await axios.get(`${API_URL}jogadores/${id}`);
        console.log('Jogador encontrado', response.data);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar o jogador com ID ${id}`, error);
        return null;
    }
};

// Função para criar um novo jogador
export const createPlayer = async (nome: string, matricula: string) => {
    try {
        console.log('Criando um novo jogador');
        const response = await axios.post(`${API_URL}jogadores`, { nome, matricula });
        console.log('Jogador criado', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar o jogador', error);
        return null;
    }
};

// Função para atualizar um jogador
export const updatePlayer = async (id: string | number, nome: string, matricula: string, horas: number) => {
    try {
        console.log(`Atualizando o jogador com ID ${id}`);
        const response = await axios.put(`${API_URL}jogadores/${id}`, { nome, matricula, horas });
        console.log('Jogador atualizado', response.data);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar o jogador com ID ${id}`, error);
        return null;
    }
};

// Função para excluir um jogador
export const deletePlayer = async (id: string | number) => {
    try {
        console.log(`Excluindo o jogador com ID ${id}`);
        const response = await axios.delete(`${API_URL}jogadores/${id}`);
        console.log('Jogador excluído', response.data);
        return response.data;
    } catch (error) {
        console.error(`Erro ao excluir o jogador com ID ${id}`, error);
        return null;
    }
};
