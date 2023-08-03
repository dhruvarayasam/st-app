import { useState } from 'react'
import { Navigate } from 'react-router-dom'

export default function Signup() {

    const [username, setUsername] = useState('');

    const [password, setPassword] = useState('');

    const [redirect, setRedirect] = useState(false);

    // make a post request

    async function handleSignupSubmit(ev) {

        ev.preventDefault();

        const response = await fetch(process.env.REACT_APP_DOMAIN_URL+'/signup', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            console.log(response)
        } else {
            setRedirect(true)
        }
    }

    if (redirect) {
        return (
            <Navigate to={"/login"} />
        )
    }


    return (
        <div className="signup">
            <h1>Sign up!</h1>
            <form onSubmit={handleSignupSubmit}>
                <input type="text"
                    placeholder="username"
                    value={username}
                    onChange={ev => setUsername(ev.target.value)}
                    className='account-input'></input>

                <input type="password"
                    placeholder="password"
                    value={password}
                    onChange={ev => setPassword(ev.target.value)}
                    className='account-input'></input>
                <button>Register</button>
            </form>
        </div>
    )
}