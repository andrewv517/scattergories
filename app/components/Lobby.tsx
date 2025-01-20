import { socket, headers } from "../socket";
import { API_URL, Game, PlayerData } from "../types";
import Image from "next/image";

export default function Lobby({ game, player }: { game: Game, player: PlayerData }) {
    const handleLeave = async () => {
        await fetch(`${API_URL}/leave`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                socketId: socket.id,
                gameName: game.id,
                name: player.name,
            }),
        })
    }

    const handleStart = async () => {
        await fetch(`${API_URL}/start`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                socketId: socket.id,
                gameName: game.id,
            }),
        })
    }

    const isHost = (p: PlayerData) => {
        return p.name === game.host.name || p.socketId === game.host.socketId;
    }

    return (
        <div className="w-full">
            <header className="flex justify-center items-center space-x-2 mt-6">
                <Image src="dice.png" width={64} height={64} alt="cards"/>
                <h1 className="text-5xl text-amber-50 font-semibold">Scattergories</h1>
            </header>
            <div className="w:5/6 sm:w-2/3 md:w-1/3 m-auto p-6">
                <div className="flex flex-row justify-between items-center space-x-4">
                    <button
                        className="p-2 pl-4 pr-4 rounded-xl drop-shadow-lg bg-red-700 font-semibold flex-1"
                        onClick={handleLeave}
                    >
                        Leave Game
                    </button>
                    {
                        isHost(player) ? <button
                            className="p-2 pl-4 pr-4 rounded-xl drop-shadow-lg bg-green-500 font-semibold flex-1"
                            onClick={handleStart}
                        >
                            Start Game
                        </button> : null
                    }
                </div>
                <div className="flex flex-row justify-center items-center my-4">
                    <p className="text-2xl font-semibold text-white">Players:</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {
                        game.players.map((gamePlayer, index) => (
                            <div
                                className="player bg-slate-400 font-semibold rounded-lg p-2 drop-shadow-xl text-slate-800 flex flex-row items-center justify-between"
                                key={index}
                            >
                                <span
                                    className={gamePlayer.socketId === player.socketId ? 'text-green-900' : ''}>{gamePlayer.name}</span>
                                {
                                    isHost(gamePlayer) ? <span>👑</span> : null
                                }

                            </div>
                        ))
                    }
                </div>


            </div>
        </div>
    )
}
