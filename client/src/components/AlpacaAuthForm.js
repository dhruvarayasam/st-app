import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { AlpacaAuthStatus } from "../contexts/AlpacaAuthStatus";

export default function AlpacaAuthForm() {

    const {userInfo} = useContext(UserContext)
    const {setAPCA_AUTH_STATUS} = useContext(AlpacaAuthStatus)

    const [APCA_API_KEY, setAPIKey] = useState('')
    const [APCA_SECRET_KEY, setSecretKey] = useState('')


    async function submitAPCACredentials(ev) {

        // makes POST request to server with APCA credentials
        // server sees if they valid 
        // if valid, server updates APCA auth status, keys, and react updates APCA auth state

        ev.preventDefault();

        const response = await fetch("http://localhost:4000/submitAPCAcreds/" + userInfo.id, {

            method: "PATCH",
            body: JSON.stringify({ APCA_API_KEY, APCA_SECRET_KEY }),
            headers: { 'Content-Type': 'application/json' }

        });

        if (!response.ok) {
            console.log(response)
        } else {
            setAPCA_AUTH_STATUS(true);
        }

    }

    return (                        
    <form className="apca-auth-form" onSubmit={submitAPCACredentials}>
    <input
        type="text"
        placeholder="alpaca api key here"
        value={APCA_API_KEY}
        onChange={ev => setAPIKey(ev.target.value)}></input>

    <input
        type="text"
        placeholder="alpaca secret key here"
        value={APCA_SECRET_KEY}
        onChange={ev => setSecretKey(ev.target.value)}></input>

    <button>Submit credentials</button>
</form>)

}