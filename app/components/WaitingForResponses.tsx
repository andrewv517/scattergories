import { Game } from "../types"

export default function WaitingForResponses({ game }: { game: Game }) {
    const nonSubmitted = () => {
        return game.players.filter(p => !p.response)
    }

    return (
        <div className="mt-3">
            <p className="font-semibold text-2xl text-amber-50 text-center">Successfully submitted your response!</p>
            <p className="text-md text-gray-400 text-center">Please wait the following to submit their responses...</p>
            <div className="grid grid-cols-2 gap-4 m-auto mt-3">
                {
                    nonSubmitted().map(player => (
                        <div
                            className="bg-slate-400 font-semibold rounded-lg p-2 drop-shadow-xl text-slate-800"
                        >
                            {player.name}
                        </div>
                    ))
                }
            </div>
        </div >
    )
}