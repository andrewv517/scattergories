import { headers, socket } from "../socket";
import { API_URL, Game, PlayerData } from "../types";
import Lobby from "./Lobby";
import ChoosingCard from "./ChoosingCard";
import GoingThroughResponses from "./GoingThroughResponses";
import Results from "./Results";

export default function GameScreen({ game, player }: { game: Game, player: PlayerData }) {

    const writingResponses = game.seconds > 0;
    const waitingOnResponses = game.players.filter(({responses}) => responses?.length === 0).length > 0;
    const showingResponses = game.playerReadingIndex !== -1;

    function renderScreen() {
        if (writingResponses || waitingOnResponses) {
            return <ChoosingCard game={game} player={player} />
        } else if (showingResponses) {
            return <GoingThroughResponses game={game} player={player} />
        }
        return <Results game={game} player={player} />;
    }

    async function handleEndGame() {
        await fetch(`${API_URL}/end`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                socketId: socket.id,
                gameName: game.id,
            }),
        })
    }

    async function handleLeaveGame() {
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

    return (
        <div>
            <div className="flex justify-between items-center">
                {
                    game.started && game.joinable ? <button
                        className="m-3 px-2 rounded-xl drop-shadow-lg bg-red-500 font-semibold"
                        onClick={handleLeaveGame}>Leave
                    </button> : <div></div>
                }
                {
                    game.host.name === player.name ?
                        <button
                            className="m-3 px-2 rounded-xl drop-shadow-lg bg-red-500 font-semibold"
                            onClick={handleEndGame}>X</button>
                        : null
                }
            </div>
            {
                game.started ?
                    <div className="flex justify-center items-center flex-col mx-auto mt-5 w-full">

                    {
                            renderScreen()
                        }


                    </div> : <Lobby game={game} player={player}/>
            }
        </div>
    )
}
