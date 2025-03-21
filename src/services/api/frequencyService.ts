import { api } from './api';
import { Frequency } from '../../types/Frequency';

export const findAllFrequencies = async (): Promise<Frequency[]> => {
    const response = await api.get('/frequencia');
    return response.data;
};

export const findFrequencyById = async (id: number): Promise<Frequency> => {
    const response = await api.get(`/frequencia/${id}`);
    return response.data;
};

export const createFrequency = async (jogoId: number, jogadorId: number): Promise<Frequency> => {
    const response = await api.post('/frequencia', {
        jogoId,
        jogadorId
    });
    return response.data;
};

export const deleteFrequency = async (id: number): Promise<void> => {
    await api.delete(`/frequencia/${id}`);
}; 

export const findFrequenciesByGameId = async (gameId: number): Promise<Frequency[]> => {
    const response = await api.get(`/frequencia`);
    return response.data.filter((freq: Frequency) => freq.jogo_id == gameId);
};