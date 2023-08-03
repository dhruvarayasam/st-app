import { useContext, useState } from "react"
import { UserContext } from "../contexts/UserContext"

export default function ChangePasswordForm() {

    const { userInfo } = useContext(UserContext)

    const [newPassword, setNewPassword] = useState('')

    const [confirmNewPassword, setConfirmation] = useState('')

    async function changePasswordRequest(ev) {

        ev.preventDefault()

        if (newPassword !== confirmNewPassword) {

            alert('passwords dont match, try again')

            setNewPassword('')
            setConfirmation('')
        }

        if (userInfo !== undefined) {

            const response = await fetch(process.env.REACT_APP_DOMAIN_URL+"/changepassword/" + userInfo.id, {
                method: "PATCH",
                body: JSON.stringify({ newPassword }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            })

            if (response.ok) {

                alert('password changed successfully')

            } else {

                const jsonData = await response.json()

                console.log(jsonData)

                alert('error changing password. try again please.')

            }

        }
    }

    return (
        <div>
            <form onSubmit={changePasswordRequest}>

                <input
                    type="password"
                    value={newPassword}
                    placeholder="enter new password"
                    onChange={ev => setNewPassword(ev.target.value)}
                ></input>

                <input
                    type="password"
                    value={confirmNewPassword}
                    placeholder="confirm new password"
                    onChange={ev => setConfirmation(ev.target.value)}
                ></input>

                <button>change password</button>
            </form>
        </div>
    )

}