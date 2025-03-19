import axios from 'axios';

const API_URL = 'http://localhost:3000/';

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

export const createManyPlayers = async (players: { nome: string; matricula: string | number }[]) => {
    try {
        console.log(`Tentando criar ${players.length} jogadores`);
        console.log('Dados enviados:', players);

        const createdPlayers = [];
        for (const player of players) {
            try {
                const response = await axios.post(`${API_URL}jogadores`, {
                    nome: player.nome,
                    matricula: String(player.matricula)
                });
                if (response.data) {
                    createdPlayers.push(response.data);
                }
            } catch (error) {
                console.error(`Erro ao criar jogador ${player.nome}:`, error);
            }
        }

        console.log(`${createdPlayers.length} jogadores criados com sucesso`);
        return createdPlayers;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Erro ao criar múltiplos jogadores:', error.response?.data || error.message);
        } else {
            console.error('Erro ao criar múltiplos jogadores:', error);
        }
        return null;
    }
};
