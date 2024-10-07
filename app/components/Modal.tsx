import { useState } from "react"

export default function Modal({onClose}: {onClose: (value: string) => void}) {
    const [name, setName] = useState('');

    const handleChange = (value: string) => {
        setName(value);
    }

    const handleSubmit = () => {
        if (!name) {
            return;
        }
        onClose(name);
    }

    return (
        <div id="container" className="fixed top-0 right-0 left-0 z-50 w-full h-full bg-black/60">
            <div className="relative w-full h-fit p-4 pb-6 mt-[40%] sm:mt-[15%] m-auto sm:w-[50%] md:w-[30%] bg-gray-700 rounded-lg shadow-2xl space-y-2">
                <div className="flex justify-between items-center">
                    <p className="text-white text-2xl font-semibold">Enter a name to play</p>
                    <div className="hover:bg-slate-500/80 rounded-md p-1">
                    </div>
                </div>
                <hr className="opacity-20" />
                    <div className="w-5/6 ml-auto mr-auto">
                        <input
                            className="w-full focus:ring-blue-500 focus:border-blue-500 rounded-xl p-2 pl-4 text-white bg-gray-500 mx-auto mt-6 block"
                            placeholder="Enter Your Name..."
                            onChange={(e) => handleChange(e.target.value)}
                        />
                            <button className="bg-blue-500 hover:bg-blue-600 text-white w-full rounded-xl p-2 font-semibold mt-7" onClick={handleSubmit} >Submit</button>
                    </div>
            </div>
        </div >
    )
}