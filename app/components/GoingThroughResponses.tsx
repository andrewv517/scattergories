import { useEffect, useMemo } from "react";
import { socket } from "../socket";
import { Game, PlayerData } from "../types";

interface ResponseHelper {
    category: string,
    response: string,
    index: number,
}

export default function GoingThroughResponses({ game, player }: { game: Game, player: PlayerData }) {

    const getNextIndex = () => {
        for (let i = game.responseIndex + 1; i < game.options.length; i++) {
            if (playerReading.responses[i].value !== '') {
                return i;
            }
        }
        return -1;
    }

    const playerReading = game.players[game.playerReadingIndex];
    const everyoneVoted = playerReading.responses[game.responseIndex].downVoters.length + playerReading.responses[game.responseIndex].upVoters.length === game.players.length;
    const shownResponse = playerReading.responses[game.responseIndex];
    const deniedByVotes = everyoneVoted && shownResponse.downVoters.length > (game.players.length > 2 ? shownResponse.upVoters.length : 0);
    const deniedBySimilarity = shownResponse.wroteSame.length > 0;
    const playerWatchingResponseDenied = player.responses[game.responseIndex].downVoters.length > (game.players.length > 2 ? player.responses[game.responseIndex].upVoters.length : 0);
    const showingLastResponse = getNextIndex() === -1;

    const handlePreviousIndex = () => {
        for (let i = game.responseIndex - 1; i >= 0; i--) {
            if (playerReading.responses[i].value !== '') {
                socket.emit('changeResponseIndex', { index: i, game })
                return;
            }
        }
    }

    const handleNextIndex = () => {
        for (let i = game.responseIndex + 1; i < game.options.length; i++) {
            if (playerReading.responses[i].value !== '') {
                socket.emit('changeResponseIndex', { index: i, game })
                return;
            }
        }
        socket.emit('doneReading', { game });
    }

    if (game.responseIndex === -1) {
        return <p>Loading</p>
    }

    console.log(game.responseIndex, playerReading);

    return (
        <div className="mt-3 space-y-3 flex flex-col justify-center items-center">
            <p className="text-2xl text-white">{playerReading.name}'s responses ({playerReading.responses.filter(r => r.value !== '').length})</p>
            {
                playerReading.name === player.name ? <p
                    className="text-md text-gray-400 text-center"
                >
                    It's your job to scroll through and read them!
                </p> : null
            }
            <div className="flex justify-between items-center w-full space-x-2">
                {
                    player.name === playerReading.name && (everyoneVoted || deniedBySimilarity) ?
                        <button
                            className="bg-neutral-500 p-2 rounded-full drop-shadow-xl h-fit"
                            onClick={handlePreviousIndex}
                        >

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                            </svg>
                        </button> : null
                }
                <div
                    className="bg-slate-400 flex-grow font-semibold rounded-lg p-4 drop-shadow-xl text-slate-800 text-center m-auto"
                >
                    <p className="font-bold underline">{game.options[game.responseIndex]}</p>
                    <p className={deniedByVotes || deniedBySimilarity ? 'line-through' : ''}>{shownResponse.value}</p>
                </div>
                {
                    player.name === playerReading.name && (everyoneVoted || deniedBySimilarity) ?
                        <button
                            className={!showingLastResponse ? "bg-neutral-500 p-2 rounded-full drop-shadow-xl h-fit" : "bg-cyan-500 m-auto p-2 pl-3 pr-3 h-fit text-white font-semibold rounded-lg drop-shadow-xl"}
                            onClick={handleNextIndex}
                        >

                            {
                                showingLastResponse ?
                                    <p className="font-semibold">Finish Reading</p> :
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                            }

                        </button> : null
                }
            </div >
            <div className="flex flex-col justify-center items-center space-y-2">
                <div className="flex flex-row items-center justify-center space-x-2">
                    <div className="bg-red-600 rounded-lg px-2 py-1">
                        <button className="text-center" onClick={() => socket.emit('downvote', { player, game })} disabled={player.name === playerReading.name}>
                            👎
                        </button>
                    </div>
                    <p className="font-semibold text-white">
                        {playerReading.responses[game.responseIndex].downVoters.length} / {game.players.length}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-center space-x-2">
                    <div className="bg-green-600 rounded-lg px-2 py-1">
                        <button className="text-center" onClick={() => socket.emit('upvote', { player, game })} disabled={player.name === playerReading.name}>
                            👍
                        </button>
                    </div>
                    <p className="font-semibold text-white">
                        {playerReading.responses[game.responseIndex].upVoters.length} / {game.players.length}
                    </p>
                </div>
            </div>
            {
                playerReading.name !== player.name ?
                    <div className="flex flex-col justify-center items-center space-y-2">
                        <p className="text-md text-gray-400 text-center">Your response for this category:</p>
                        <div
                            className={`bg-slate-400 flex-grow font-semibold rounded-lg p-4 drop-shadow-xl text-slate-800 text-center 
                                m-auto w-full ${playerWatchingResponseDenied ? 'line-through' : ''}`}
                        >
                            <p>{player.responses[game.responseIndex]?.value || 'No response...'}</p>
                        </div>
                        {
                            player.responses[game.responseIndex]?.value !== '' ?
                                <button
                                    className="bg-red-500 m-auto p-2 pl-3 pr-3 h-fit text-black font-semibold rounded-lg drop-shadow-xl"
                                    disabled={player.responses[game.responseIndex]?.value === ''}
                                    onClick={() => socket.emit('wroteSame', { player, game })}
                                >
                                    I wrote the same
                                </button > : null
                        }
                    </div> : null
            }


        </div>
    )
}