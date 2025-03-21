import { api } from './api';
import { Player } from '../../types/Player';

interface PlayerResponse {
    id: number;
    nome: string;
    matricula: string;
    horas?: number;
}

export const findAllPlayers = async (): Promise<Player[]> => {
    const response = await api.get<PlayerResponse[]>('/jogadores');
    return response.data.map(player => ({
        id: player.id,
        name: player.nome,
        registrationNumber: player.matricula,
        horas: Number(player.horas) || 0
    }));
};

export const findPlayersByGameId = async (gameId: number): Promise<Player[]> => {
    const response = await api.get<PlayerResponse[]>(`/jogadores/jogo/${gameId}`);
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(player => ({
        id: player.id,
        name: player.nome,
        registrationNumber: player.matricula,
        horas: Number(player.horas) || 0
    }));
};

export const findPlayerById = async (id: number): Promise<Player> => {
    const response = await api.get<PlayerResponse>(`/jogadores/${id}`);
    return {
        id: response.data.id,
        name: response.data.nome,
        registrationNumber: response.data.matricula,
        horas: Number(response.data.horas) || 0
    };
};

export const createPlayer = async (name: string, registrationNumber: string): Promise<Player> => {
    const response = await api.post<PlayerResponse>('/jogadores', {
        nome: name,
        matricula: registrationNumber
    });
    return {
        id: response.data.id,
        name: response.data.nome,
        registrationNumber: response.data.matricula,
        horas: Number(response.data.horas) || 0
    };
};

export const updatePlayer = async (id: number, name: string, registrationNumber: string, horas: number): Promise<Player> => {
    const response = await api.put<PlayerResponse>(`/jogadores/${id}`, {
        nome: name,
        matricula: registrationNumber,
        horas: horas
    });
    return {
        id: response.data.id,
        name: response.data.nome,
        registrationNumber: response.data.matricula,
        horas: Number(response.data.horas) || 0
    };
};

export const deletePlayer = async (id: number): Promise<void> => {
    await api.delete(`/jogadores/${id}`);
};

export const createManyPlayers = async (players: { nome: string; matricula: string }[]): Promise<Player[]> => {
    const response = await api.post<PlayerResponse[]>('/jogadores/batch', players);
    return response.data.map(player => ({
        id: player.id,
        name: player.nome,
        registrationNumber: player.matricula,
        horas: Number(player.horas) || 0
    }));
};

