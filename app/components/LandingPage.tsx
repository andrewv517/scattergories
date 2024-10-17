import { useEffect, useState } from "react"
import { API_URL, COOKIE_NAME, Game } from "../types"
import Modal from "./Modal";
import { headers, socket } from "../socket";
import { cookies } from "next/headers";
import { useCookies } from "react-cookie";

export default function LandingPage() {
    const [games, setGames] = useState<Game[]>([])
    const [cookies, setCookie, removeCookie] = useCookies([COOKIE_NAME]);
    const [showingModal, setShowingModal] = useState(false);
    const [actionState, setActionState] = useState('');
    const [gameIdState, setGameIdState] = useState('');

    useEffect(() => {
        const getGames = async () => {
            const res = await fetch(`${API_URL}/games`);
            const json: { games: Game[] } = await res.json();
            setGames(json.games);
        }
        getGames();
        socket.on('gamesInformation', (gameInfo: Game[]) => {
            setGames(gameInfo);
        })
    }, [])

    const handleModal = (actionParam: string, gameName?: string) => {
        if (gameName) {
            setGameIdState(gameName);
        }

        const priorName = cookies["scattergories-cookie"];
        if (priorName) {
            hideModal(priorName, actionParam, gameName);
        } else {
            setActionState(actionParam);
            setShowingModal(true)
        }
    }

    const hideModal = (name: string, action: string, gameId?: string) => {
        if (action === 'join') {
            if (!gameId) return;
            handleJoinGame(name, gameId);
        } else {
            handleCreateGame(name);
        }
    }

    const handleJoinGame = async (name: string, gameName: string) => {
        await fetch(`${API_URL}/joinGame`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                socketId: socket.id,
                name,
                gameName,
            })
        })
        setCookie(COOKIE_NAME, name);
    }

    const handleCreateGame = async (name: string) => {
        await fetch(`${API_URL}/createGame`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                socketId: socket.id,
                name,
            })
        })
        setShowingModal(false);
        setCookie(COOKIE_NAME, name);
    }

    return (
        <>
            {
                showingModal ? <Modal onClose={(nameValue) => hideModal(nameValue, actionState, gameIdState)} /> : null
            }
            <div className="grid grid-cols-1 w-5/6 sm:w-2/3 m-auto space-y-5 mt-10 text-center">
                <p className="text-2xl text-amber-50 font-semibold">Join a game...</p>
                {
                    games.length > 0 ?
                        <div>
                            {
                                games.filter(({started}) => !started).map((game, index) => (
                                    <div
                                        key={index}
                                        className="bg-slate-400 font-semibold rounded-lg p-2 drop-shadow-xl text-slate-800 flex flex-row justify-between items-center my-4"
                                    >
                                        <div className="flex-1 flex justify-start">Host: {game.host.name}</div>
                                        <div>
                                            <button className="flex flex-row items-center space-x-4 w-fit m-auto px-4 py-1 rounded-xl text-white drop-shadow-xl bg-green-600" onClick={() => handleModal('join', game.id)}>
                                                <span>Join</span>
                                                <div className="flex flex-row space-x-1 items-center text-gray-300">
                                                    <span className="text-sm">
                                                        {game.players.length}
                                                    </span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                                                    </svg>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        :
                        <div className="flex justify-center items-center space-x-2">
                            <p className="text-gray-400 font-semibold">Searching for games</p>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                }

                <p className="text-2xl text-amber-50 font-semibold">Or Create Your Own!</p>
                <button
                    className="w-fit m-auto pl-4 pr-4 pt-2 pb-2 rounded-xl text-black font-semibold drop-shadow-xl bg-yellow-400"
                    onClick={() => handleModal('create')}
                >
                    Create
                </button>
            </div>
        </>
    )
}