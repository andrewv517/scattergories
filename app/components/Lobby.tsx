import { socket } from "../socket";
import { Game, PlayerData } from "../types";

export default function Lobby({ game, player }: { game: Game, player: PlayerData }) {
    const handleLeave = () => {
        socket.emit('leave', { name: player.name, game });
    }

    const isHost = (p: PlayerData) => {
        return p.name === game.host.name || p.socketId === game.host.socketId;
    }

    return (
        <div className="w-full">
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
                            onClick={() => socket.emit('start', { game })}
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
                                <span className={gamePlayer.socketId === player.socketId ? 'text-green-900' : ''}>{gamePlayer.name}</span>
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