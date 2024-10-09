import { socket } from "../socket";
import { Game, PlayerData } from "../types";
import Lobby from "./Lobby";
import ChoosingCard from "./ChoosingCard";
import GoingThroughResponses from "./GoingThroughResponses";
import Results from "./Results";

export default function GameScreen({ game, player }: { game: Game, player: PlayerData }) {

    const writingResponses = game.seconds > 0;
    const showingResponses = game.playerReadingIndex !== -1;

    function renderScreen() {
        if (writingResponses) {
            return <ChoosingCard game={game} player={player} />
        } else if (showingResponses) {
            return <GoingThroughResponses game={game} player={player} />
        }
        return <Results game={game} player={player} />;
    }

    return (
        <div>
            {
                game.host.name === player.name ?
                    <button className="absolute top-0 right-0 m-3 px-2 rounded-xl drop-shadow-lg bg-red-500 font-semibold" onClick={() => socket.emit('end', { game })}>X</button>
                    : null
            }
            {
                game.started ?
                    <div className="flex justify-center items-center flex-col mx-auto mt-5 w-full">

                        {
                            renderScreen()
                        }


                    </div> : <Lobby game={game} player={player} />
            }
        </div>
    )
}