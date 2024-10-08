import { useEffect, useMemo } from "react";
import { socket } from "../socket";
import { Game, PlayerData } from "../types";

interface ResponseHelper {
    category: string,
    response: string,
    index: number,
}

export default function GoingThroughResponses({ game, player }: { game: Game, player: PlayerData }) {

    const playerReading = useMemo(() => {
        return game.players.find(p => p.name === game.playerReading.name);
    }, [game])

    const handleNextIndex = () => {
        for (let i = game.responseIndex + 1; i < game.options.length; i++) {
            if (playerReading?.responses[i].value !== '') {
                socket.emit('changeResponseIndex', { index: i, game })
                return;
            }
        }

        // start from beginning
        for (let i = 0; i < game.responseIndex; i++) {
            if (playerReading?.responses[i].value !== '') {
                socket.emit('changeResponseIndex', { index: i, game });
                return;
            }
        }

        // didnt submit anything
        return;
    }

    useEffect(() => {
        if (playerReading && player.name === playerReading.name && game.responseIndex === -1 && playerReading.responses.length > 0) {
            // start from beginning
            for (let i = 0; i < game.options.length; i++) {
                if (playerReading.responses[i].value !== '') {
                    console.log(playerReading.responses[i].value, i);
                    socket.emit('changeResponseIndex', { index: i, game });
                    return;
                }
            }
            socket.emit('doneReading', { game });
        }
    }, [game])

    if (game.responseIndex === -1) {
        return <p>Loading</p>
    }

    const deleteResponse = () => {
        const responses = [...player.responses];
        responses[game.responseIndex].value = '';

        if (playerReading) {
            const readingResponses = [...playerReading.responses];
            readingResponses[game.responseIndex].value = '';
            socket.emit('responses', { game, playerReading, readingResponses });
        }
        socket.emit('responses', { game, player, responses });
    }

    return (
        <div className="mt-3 space-y-3 flex flex-col justify-center items-center">
            <p className="text-2xl text-white">{playerReading?.name}'s responses ({playerReading?.responses.filter(r => r.value !== '').length})</p>
            {
                playerReading?.name === player.name ? <p
                    className="text-md text-gray-400 text-center"
                >
                    It's your job to scroll through and read them!
                </p> : null
            }
            <div className="flex justify-between items-center w-full space-x-2">

                <div
                    className="bg-slate-400 flex-grow font-semibold rounded-lg p-4 drop-shadow-xl text-slate-800 text-center m-auto"
                >
                    <p className="font-bold underline">{game.options[game.responseIndex]}</p>
                    <p className={(playerReading?.responses[game.responseIndex].downVoters.length ?? 0) > Math.floor(game.players.length / 2) ? 'line-through' : ''}>{playerReading?.responses[game.responseIndex]?.value}</p>
                </div>
                {
                    player.name === playerReading?.name ?
                        <button
                            className="bg-neutral-500 p-2 rounded-full drop-shadow-xl h-fit"
                            onClick={handleNextIndex}
                        >

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                            </svg>
                        </button> : null
                }
            </div >
            <div className="flex flex-row items-center justify-center space-x-2">
                <div className="bg-red-600 rounded-lg px-2 py-1">
                    <button className="text-center" onClick={() => socket.emit('downvote', { player, game })} disabled={player.name === playerReading?.name}>
                        👎
                    </button>
                </div>
                <p className="font-semibold text-white">
                    {playerReading?.responses[game.responseIndex].downVoters.length} / {game.players.length}
                </p>
            </div>
            {
                playerReading?.name === player.name ?
                    <button
                        className="bg-cyan-500 m-auto p-2 pl-3 pr-3 h-fit text-white font-semibold rounded-lg drop-shadow-xl"
                        onClick={() => socket.emit('doneReading', { game })}
                    >
                        Done reading
                    </button > : null
            }
            {
                playerReading?.name !== player.name && player.responses[game.responseIndex]?.value !== '' ?
                    <div className="flex flex-col justify-center items-center space-y-2">
                        <p className="text-md text-gray-400 text-center">Your response for this category:</p>
                        <div
                            className="bg-slate-400 flex-grow font-semibold rounded-lg p-4 drop-shadow-xl text-slate-800 text-center m-auto w-full"
                        >
                            <p>{player.responses[game.responseIndex]?.value}</p>
                        </div>
                        <button
                            className="bg-red-500 m-auto p-2 pl-3 pr-3 h-fit text-black font-semibold rounded-lg drop-shadow-xl"
                            onClick={deleteResponse}
                        >
                            I wrote the same
                        </button >
                    </div> : null
            }


        </div>
    )
}