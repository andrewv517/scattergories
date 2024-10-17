import { socket, headers } from "../socket";
import { API_URL, Game, PlayerData } from "../types";

export default function Results({ game, player }: { game: Game, player: PlayerData }) {
    const isHost = () => {
        return game.host.name === player.name;
    }

    function nextRound() {
        fetch(`${API_URL}/nextRound`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                socketId: socket.id,
                gameName: game.id,
            }),
        })
    }

    return (
        <div className="space-y-4 w-full flex flex-col justify-center items-center px-2">
            <p className="font-semibold text-2xl text-slate-300 text-center underline">
                Leaderboard
            </p>

            <div className="w-full md:w-1/2 space-y-4">
                {
                    [...game.players]
                        .sort((a, b) => b.points - a.points)
                        .map((p, index) => (
                            <div className="bg-slate-400 font-semibold rounded-lg p-2 drop-shadow-xl text-slate-800 flex flex-row justify-between items-center" key={index}>
                                <span className="w-1/6">{index + 1}.</span>
                                <span className="w-1/2 text-left">
                                    {p.name}
                                </span>
                                <span className="w-1/3 flex justify-end">{p.points}pts</span>
                            </div>
                        ))
                }
            </div>


            {
                isHost() ?
                    <button
                        className="bg-green-500 text-white w-fit font-semibold py-2 px-4 drop-shadow-xl rounded-lg"
                        onClick={nextRound}
                    >
                        Next round
                    </button> : null
            }

        </div>
    )
}