import { useState, useContext } from 'react';
import {Navigate} from 'react-router-dom'
import { UserContext } from '../contexts/UserContext';

export default function Login () {

    const [username, setUsername] = useState('');

    const[password, setPassword] = useState('');

    const [redirect, setRedirect] = useState(false)

    const {setUserInfo} = useContext(UserContext)

    async function loginSubmit(ev) {

        ev.preventDefault();

        const response = await fetch("http://localhost:4000/login", {
            method:"POST",
            body:JSON.stringify({username, password}),
            headers: {'Content-Type':'application/json'},
            credentials: 'include'
        })

        if (response.ok) {

            response.json().then(userInfo => {

                setUserInfo(userInfo)

                setRedirect(true);

            })

        } else {

            alert('wrong credentials')

        }

    }

    if (redirect) {

        return (<Navigate to={'/'} />)

    }

    return (
        <div className="login">
            <form onSubmit={loginSubmit}>
            <h2>Login</h2>
                <input 
                    type="text" 
                    placeholder="username" 
                    value={username}
                    onChange={ev => setUsername(ev.target.value)}
                    className='account-input'

                ></input>
                <input type="password" 
                placeholder="password" 
                value={password}
                onChange={ev => setPassword(ev.target.value)}
                className="account-input"
                ></input>
                <button>Log in</button>
            </form>
        </div>
    )

}