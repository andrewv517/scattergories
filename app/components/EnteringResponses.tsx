import { useState } from "react"
import { socket } from "../socket";
import { Game, PlayerData } from "../types";

export default function EnteringResponses({ isInHotSeat, game, player }: { isInHotSeat: boolean, game: Game, player: PlayerData }) {
    const [response, setResponse] = useState('');

    return (
        <div className="space-y-5">
            <div className="space-y-1">
                <p className="text-xl text-gray-300 font-semibold">Scoring</p>
                <p className="text-md text-gray-400">
                    As a reminder, points are awarded based on your role in the game:
                </p>
                <p className="text-lg text-gray-300 font-semibold">Player in the Hot Seat
                    {
                        isInHotSeat ? <span>(this is you)</span> : null
                    }:

                </p>
                <ul>
                    <li className="text-gray-400 text-md">1 point for each player that correctly guesses the answer you wrote.
                    </li>
                </ul>
                <p className="text-gray-300 font-semibold text-lg">All Other Players
                    {
                        !isInHotSeat ? <span>(this is you)</span> : null
                    }:
                </p>
                <ul className="text-gray-400 text-md ">
                    <li>1 point for each player that guesses your answer.</li>
                    <li>2 points for guessing the player in the Hot Seat's answer correctly</li>
                    <li>4 points for responding with the same answer as the player in the Hot Seat</li>
                </ul>
            </div>
            <p className="text-gray-300 text-lg font-semibold">Submit your response here.</p>
            <div className="space-x-5 text-center space-y-3">
                <input
                    className="input w-2/3 text-lg sm:text-md max-w-sm focus:ring-blue-500 focus:border-blue-500 rounded-xl p-2 text-white bg-gray-500"
                    placeholder="Enter your response..."
                    onChange={(e) => setResponse(e.target.value)}
                />
                <button
                    className="bg-green-500 disabled:bg-gray-500 p-2 pl-3 pr-3 h-fit text-white font-semibold rounded-lg drop-shadow-xl"
                    disabled={response.length === 0}
                    onClick={() => socket.emit('response', { response, game, player })}
                    >Submit
                </button>
            </div>
        </div >
    )
}