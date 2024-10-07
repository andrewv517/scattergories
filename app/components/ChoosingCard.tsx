import { useEffect, useState } from "react";
import { socket } from "../socket";
import { Game, PlayerData, PlayerResponse } from "../types";

export default function ChoosingCard({ game, player }: { game: Game, player: PlayerData }) {
    const [responses, setResponses] = useState<PlayerResponse[]>(Array.from({length: game.options.length}, () => ({value: '', downVoters: []})));

    const isHost = () => {
        return game.host.name === player.name;
    }

    const formatTime = () => {
        const minutes = Math.floor(game.seconds / 60);
        const seconds = game.seconds % 60;
        return `${minutes}m ${seconds}s`;
    }

    const handleResponseUpdate = (index: number, value: string) => {
        const newResponses = [...responses];
        newResponses[index].value = value;
        setResponses(newResponses);
    }

    useEffect(() => {
        if (game.seconds <= 0) {
            socket.emit('responses', { game, player, responses })
        }
    }, [game.seconds])

    return (
        <div className="flex flex-col justify-center items-center space-y-3 text-white">
            <div>
                <div className="flex flex-col justify-center items-center space-y-4">
                    <div className="flex flex-row items-center justify-center space-x-4">
                        <p className="text-3xl">Letter: {game.letter}</p>
                        {
                           (isHost() && !game.choseLetter) ?
                                <button className="bg-slate-900 p-1 rounded-md" onClick={() => socket.emit('getLetter', { game })}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                </button> : null
                        }
                    </div>
                    {
                        (isHost() && !game.choseLetter) ? 
                        <button className="bg-green-500 text-white m-auto w-fit font-semibold py-2 px-4 drop-shadow-xl rounded-lg" onClick={() => socket.emit('choseLetter', { game })}>Start Round</button> : null
                    }
                    
                </div>
                {
                    game.choseLetter ? 
                    <p className="text-lg">Time left: {formatTime()}</p> : null
                }
            </div>
            <table className="mx-auto table-auto border-separate border-spacing-y-2 p-3 shadow-xl md:border-2 border-red-950 rounded-lg">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Response</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        game.options.map((option, index) => (
                            <tr
                                key={index}
                            >
                                <td className="border-b border-slate-700 px-2 py-1 font-medium">{option}</td>
                                <td className="border-b border-slate-700 px-2 py-1">
                                    <input type="text"
                                        className="bg-transparent border-red-950 border rounded-md px-1 font-semibold text-slate-800 placeholder-opacity-30 placeholder-slate-800 focus:ring-blue-500 
                                    focus:border-blue-500" placeholder="Empty"
                                    onChange={(e) => handleResponseUpdate(index, e.target.value)}
                                        disabled={!game.choseLetter || game.seconds <= 0}
                                    />
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

        </div>
    )
}