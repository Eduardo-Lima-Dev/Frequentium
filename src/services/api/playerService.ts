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