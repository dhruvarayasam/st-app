import { useContext } from "react"
import { UserContext } from "../contexts/UserContext"
import AlpacaAuthForm from "./AlpacaAuthForm";
import ChangePasswordForm from "./ChangePasswordForm";
import ChangeUsernameForm from "./ChangeUsernameForm";
 
export default function Settings() {

    const { userInfo } = useContext(UserContext)
    const userInfoLength = Object.keys(userInfo).length;

    return (
        <div>

            <h1>SETTINGS</h1>

            {userInfoLength > 1 && (
                <div>
                    <h3>reset your alpaca credentials here: </h3>
                    <AlpacaAuthForm />

                    <h3>Change username: </h3>

                    <ChangeUsernameForm />
                    
                    <h3>Change password: </h3>
                    <ChangePasswordForm />
                </div>
            )}


        </div>
    )

}