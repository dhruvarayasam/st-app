import { useContext, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext"
import logo from "../styles/logo.jpg"
import Cookies from "js-cookie";

export default function Navbar() {

    const {setUserInfo, userInfo} = useContext(UserContext);

    const [redirect, setRedirect] = useState(false)

    useEffect(() => {
        fetch(process.env.REACT_APP_DOMAIN_URL+"/profile", {
            method: 'POST',
            body: JSON.stringify({'token':Cookies.get('token')}),
            headers: {'Content-Type':'application/json'},
            credentials: 'include'
        }).then(response => {

            response.json().then(userInfo => {
                setUserInfo(userInfo)
            }).catch((err) => console.log(err))

        })
    }, [setUserInfo])

    function logout() {

        fetch(process.env.REACT_APP_DOMAIN_URL+"/logout", {
            credentials: 'include',
            method: 'POST'
        });

        setUserInfo({})
        return (<Navigate to={'/'} />)

    }


    const username = userInfo?.username;

    return (

        <div className="navbar">
            <nav>
                {username && (
                    <div className="nav-button-group">
                        <Link to="/"><img src={logo} alt="logo"/></Link>
                        <button onClick={logout} className="nav-button">Logout</button>
                        <Link to="/settings"><button className="nav-button">Account Settings</button></Link>
                        <Link to="/accounthome"><button className="nav-button">Profile</button></Link>
                    </div>
                )}

                {!username && (
                    <div className="nav-button-group">
                        <Link to="/"><img src={logo} alt="logo"/></Link>
                        <Link to="/login"><button className="nav-button">Login</button></Link>
                        <Link to="/signup"><button className="nav-button">Sign up</button></Link>
                    </div>
                )}
            </nav>
        </div>

    )

}