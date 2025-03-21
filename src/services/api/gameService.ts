import { api } from './api';
import { Game } from '../../types/Game';

interface GameResponse {
    id: number;
    data: string;
    duracao: number;
}

export const findAllGames = async (): Promise<Game[]> => {
    const response = await api.get<GameResponse[]>('/jogos');
    return response.data.map(game => ({
        id: game.id,
        data: game.data,
        duracao: game.duracao
    }));
};

export const findGameById = async (id: number): Promise<Game> => {
    const response = await api.get<GameResponse>(`/jogos/${id}`);
    return {
        id: response.data.id,
        data: response.data.data,
        duracao: response.data.duracao
    };
};

export const createGame = async (data: string, duracao: number): Promise<Game> => {
    const response = await api.post<GameResponse>('/jogos', {
        data,
        duracao
    });
    return {
        id: response.data.id,
        data: response.data.data,
        duracao: response.data.duracao
    };
};

export const updateGame = async (id: number, data: string, duracao: number): Promise<Game> => {
    const response = await api.put<GameResponse>(`/jogos/${id}`, {
        data,
        duracao
    });
    return {
        id: response.data.id,
        data: response.data.data,
        duracao: response.data.duracao
    };
};

export const deleteGame = async (id: number): Promise<void> => {
    await api.delete(`/jogos/${id}`);
};

export const findPlayersByGameId = async (id: number): Promise<Game[]> => {
    const response = await api.get<GameResponse[]>(`/jogadores/jogo/${id}`);
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(game => ({
        id: game.id,
        data: game.data,
        duracao: game.duracao
    }));
};