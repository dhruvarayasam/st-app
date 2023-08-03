import { useContext, useEffect, useState, useCallback } from "react"
import { UserContext } from "../contexts/UserContext"

export default function GetFavs() {

    const {userInfo} = useContext(UserContext)

    const [favsList, setFavsList] = useState([])

    const getFavsList = useCallback(async () => {

        if (userInfo.id !== undefined) {
            
                await fetch(process.env.REACT_APP_DOMAIN_URL+"/getfavs/"+userInfo.id).then(async (res) => {
                    
                    const jsonData = await res.json()
    
                    console.log(jsonData.APCA_FAVS_LIST)

                    setFavsList(jsonData.APCA_FAVS_LIST)

    
                })

        }

    }, [userInfo])

    useEffect(() => {
        getFavsList()
    }, [getFavsList])


    if (userInfo.favsList !== undefined) {
        return (
            <div className="fav-stocks-list">
                {favsList.length > 0 && (
                    userInfo.favsList.map((el) => {
                        console.log(el)
                        return (
                            <p className="favorite-stocks-ticker">{el}</p>
                        )
                    })
                )}
            </div>
        )
    }

}