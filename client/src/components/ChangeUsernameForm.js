import { useContext, useState } from "react"
import { UserContext } from "../contexts/UserContext"

export default function ChangeUsernameForm() {

    const { userInfo } = useContext(UserContext)

    const [newUsername, setNewUsername] = useState('')

    const [confirmNewUsername, setConfirmation] = useState('')

    async function changeUsernameRequest(ev) {

        ev.preventDefault()

        if (newUsername !== confirmNewUsername) {

            alert('username dont match, try again')

            setNewUsername('')
            setConfirmation('')
        }

        if (userInfo !== undefined) {

            const response = await fetch("http://localhost:4000/changeusername/" + userInfo.id, {
                method: "PATCH",
                body: JSON.stringify({ newUsername }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            })

            if (response.ok) {

                alert('username changed successfully')

            } else {

                const jsonData = await response.json()

                console.log(jsonData)

                alert('error changing username. try again please.')

            }

        }
    }

    return (
        <div>
            <form onSubmit={changeUsernameRequest}>

                <input
                    type="text"
                    value={newUsername}
                    placeholder="enter new username"
                    onChange={ev => setNewUsername(ev.target.value)}
                ></input>

                <input
                    type="text"
                    value={confirmNewUsername}
                    placeholder="confirm new username"
                    onChange={ev => setConfirmation(ev.target.value)}
                ></input>

                <button>change username</button>
            </form>
        </div>
    )

}