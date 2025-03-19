import React from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

interface Player {
    id: number;
    name: string;
    registrationNumber: string;
    date: string;
}

interface PlayerTableProps {
    players: Player[];
    editPlayer: (player: Player) => void; 
}

const PlayerTable: React.FC<PlayerTableProps> = ({ players, editPlayer }) => {
    return (
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md w-full">
            <table className="table-auto min-w-full mx-auto table-fixed">
                <thead className="bg-gray-700 text-left">
                    <tr>
                        <th className="px-6 py-4 text-center">Jogador</th>
                        <th className="px-6 py-4 text-center">Matrícula</th>
                        <th className="px-6 py-4 text-center">Horas</th>
                        <th className="px-6 py-4 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map((player) => {
                        const playerInitial = player.name.charAt(0).toUpperCase(); 
                        return (
                            <tr key={player.id} className="border-b border-gray-700">
                                <td className="px-6 py-4 text-left flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center mr-4">
                                        {playerInitial}  {/* Inicial do nome do jogador */}
                                    </div>
                                    {player.name}
                                </td>
                                <td className="px-6 py-4 text-center">{player.registrationNumber}</td>
                                <td className="px-6 py-4 text-center">{player.date}</td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => editPlayer(player)} 
                                        className="text-green-500 mr-6"  
                                        title="Editar"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button className="text-red-500" title="Excluir">
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default PlayerTable;
