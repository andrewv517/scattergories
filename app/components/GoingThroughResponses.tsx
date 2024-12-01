import { headers, socket } from "../socket";
import { API_URL, Game, PlayerData } from "../types";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useEffect, useState } from "react";
import FlyingEmoji from "./FlyingEmoji";

const REACTION_EMOJI_IDS = [
    '1f602',
    '1f621',
    '1f480',
    '2754',
    '1f44d',
    '1f44e',
    '1f4a9',
]

export default function GoingThroughResponses({ game, player }: { game: Game, player: PlayerData }) {
    const [flyingEmojis, setFlyingEmojis] = useState<React.JSX.Element[]>([]);

    const getNextIndex = () => {
        for (let i = game.responseIndex + 1; i < game.options.length; i++) {
            if (playerReading.responses[i].value !== '') {
                return i;
            }
        }
        return -1;
    }

    const playerReading = game.players[game.playerReadingIndex];

    useEffect(() => {
        if (!socket.hasListeners('reaction')) {
            socket.on('reaction', (({ emojiId }: { emojiId: string }) => {
                setFlyingEmojis(currentFlyingEmojis => [...currentFlyingEmojis, <FlyingEmoji emoji={emojiId}
                                                                                             duration={2500}
                                                                                             key={`${socket.id}_${emojiId}_${currentFlyingEmojis.length}`} />])
            }));
        }

        return () => {
            socket.off('reaction');
        }
    }, [])

    if (!playerReading || !playerReading.responses[game.responseIndex]) {
        return <p>Loading...</p>
    }

    const everyoneVoted = playerReading.responses[game.responseIndex].downVoters.length + playerReading.responses[game.responseIndex].upVoters.length >= Math.round(game.players.length / 2);
    const shownResponse = playerReading.responses[game.responseIndex];
    const deniedByVotes = everyoneVoted && shownResponse.downVoters.length > (game.players.length > 2 ? shownResponse.upVoters.length : 0);
    const deniedBySimilarity = shownResponse.wroteSame.length > 0;
    const playerWatchingResponseWroteSame = shownResponse.wroteSame.indexOf(player.name) !== -1;
    const alreadyRead = game.playerReadingIndex >= game.players.map(({ name }) => name).indexOf(player.name); // this is so fucking bad
    const playerWatchingResponseDenied = player.responses[game.responseIndex].downVoters.length > (game.players.length > 2 ? player.responses[game.responseIndex].upVoters.length : 0)
        || playerWatchingResponseWroteSame;
    const showingLastResponse = getNextIndex() === -1;
    const votedUp = shownResponse.upVoters.indexOf(player.name) !== -1;
    const votedDown = shownResponse.downVoters.indexOf(player.name) !== -1;
    const votedWroteSame = shownResponse.wroteSame.indexOf(player.name) !== -1;

    const handlePreviousIndex = () => {
        for (let i = game.responseIndex - 1; i >= 0; i--) {
            if (playerReading.responses[i].value !== '') {
                fetch(`${API_URL}/changeResponseIndex`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                        socketId: socket.id,
                        index: i,
                        gameName: game.id,
                    }),
                })
                return;
            }
        }
    }

    const handleReaction = (reaction: EmojiClickData) => {
        socket.emit('reactionMade', { emojiId: reaction.emoji, gameName: game.id })
    }

    const handleNextIndex = () => {
        for (let i = game.responseIndex + 1; i < game.options.length; i++) {
            if (playerReading.responses[i].value !== '') {
                fetch(`${API_URL}/changeResponseIndex`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                        socketId: socket.id,
                        index: i,
                        gameName: game.id,
                    }),
                })
                return;
            }
        }
        fetch(`${API_URL}/doneReading`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                socketId: socket.id,
                gameName: game.id,
            }),
        })
    }

    function downVote() {
        fetch(`${API_URL}/downVote`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                socketId: socket.id,
                playerName: player.name,
                gameName: game.id,
            }),
        })
    }

    function upVote() {
        fetch(`${API_URL}/upVote`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                socketId: socket.id,
                playerName: player.name,
                gameName: game.id,
            }),
        })
    }

    function wroteSame() {
        fetch(`${API_URL}/wroteSame`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                socketId: socket.id,
                playerName: player.name,
                gameName: game.id,
            }),
        })
    }

    if (game.responseIndex === -1) {
        return <p>Loading</p>
    }

    return (
        <div className="mt-3 space-y-3 flex flex-col justify-center items-center">
            <p className="text-2xl text-white">{playerReading.name}&#39;s responses ({playerReading.responses.filter(r => r.value !== '').length})</p>
            {
                playerReading.name === player.name ? <p
                    className="text-md text-gray-400 text-center"
                >
                    It&#39;s your job to scroll through and read them!
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
            </div>
            <div className="flex flex-col justify-center items-center space-y-2">
                <div>
                    <p className="text-red-400 font-semibold text-lg">
                        {
                            shownResponse.wroteSame.length > 0 ? shownResponse.wroteSame.join(", ") + ' wrote the same!' : null
                        }
                    </p>
                </div>
                {
                    playerReading.name !== player.name && (votedUp || votedDown) && !deniedBySimilarity ?
                        <p className="font-semibold text-white text-lg">
                            You voted <span className={`${votedUp ? 'text-green-600' : 'text-red-600'} font-semibold`}>{votedUp ? 'up' : 'down'}</span>
                        </p> : null
                }
                <div className="flex flex-row items-center justify-center space-x-2">
                    <div className={`${votedDown ? 'bg-red-700' : 'bg-red-600'} rounded-lg px-2 py-1`}>
                        <button className="text-center" onClick={downVote} disabled={player.name === playerReading.name || playerWatchingResponseWroteSame}>
                            👎
                        </button>
                    </div>
                    <p className="font-semibold text-white">
                        {playerReading.responses[game.responseIndex].downVoters.length} / {game.players.length}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-center space-x-2">
                    <div className={`${votedUp ? 'bg-green-700' : 'bg-green-600'} rounded-lg px-2 py-1`}>
                        <button className="text-center" onClick={upVote} disabled={player.name === playerReading.name || playerWatchingResponseWroteSame}>
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
                                    className={`${votedWroteSame ? 'bg-red-700' : 'bg-red-600'} m-auto p-2 pl-3 pr-3 h-fit text-black font-semibold rounded-lg drop-shadow-xl`}
                                    disabled={player.responses[game.responseIndex]?.value === '' || (playerWatchingResponseWroteSame && alreadyRead)}
                                    onClick={wroteSame}
                                >
                                    I wrote the same
                                </button > : null
                        }
                    </div> : null
            }
            <div>
                {flyingEmojis}
            </div>
            <div className="fixed bottom-2">
                <EmojiPicker
                    reactionsDefaultOpen={true}
                    allowExpandReactions={false}
                    reactions={REACTION_EMOJI_IDS}
                    onReactionClick={handleReaction}
                    lazyLoadEmojis={true}
                />
            </div>

        </div>
    )
}
