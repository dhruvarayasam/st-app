import { useContext, useState } from "react"
import { UserContext } from "../contexts/UserContext"



export default function AddToFavs() {

    const { userInfo } = useContext(UserContext)

    const [ticker, setTicker] = useState('')

    async function handleSubmit(ev) {
        ev.preventDefault()



        if (userInfo.id !== undefined) {

            await fetch("http://localhost:4000/addtofavs/" + userInfo.id, {
                method: "POST",
                body: JSON.stringify({ ticker }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            }).then(async (res) => {

                
                

            }).catch((err) => {

                console.log(err)

            })

        }

    }


    return (
        <div>
            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    placeholder="type valid ticker here"
                    value={ticker}
                    onChange={ev => setTicker(ev.target.value)}
                ></input>

                <button className="submitButton">add to favs</button>

            </form>
        </div>
    )


}