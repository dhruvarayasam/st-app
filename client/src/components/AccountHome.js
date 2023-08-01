import { useContext, useEffect, useState, useCallback } from 'react';
import { UserContext } from '../contexts/UserContext';
import { AlpacaAuthStatus } from '../contexts/AlpacaAuthStatus';
import { Navigate, Link } from 'react-router-dom';
import 'react-dropdown/style.css';
import PortfolioHistory from './PortfolioHistory';
import AlpacaAuthForm from './AlpacaAuthForm';
import GetFavs from './GetFavs';
import AddToFavs from './AddToFavs';
import OrderComponent from './OrderComponent';

// how it works:
// APCAAuthStatus is set false by default
// checkAPCAAuthStatus is run: fetches from Mongo whether user has valid APCA credentials
// if return true, renders APCA data elements and other tools
// if return false, renders form to send in APCA credentials

// form function:
// authenticates APCA credentials: if wrong, let user know
// if APCA credentials are valid, send PATCH request to MONGO database and set APCAAuthStatus to true

export default function AccountHome() {

    const { userInfo } = useContext(UserContext);
    const { APCA_AUTH_STATUS, setAPCA_AUTH_STATUS } = useContext(AlpacaAuthStatus)


    useEffect(() => { // update auth status every time component reloads
        if (userInfo !== null && userInfo.id !== undefined) {

            fetch('http://localhost:4000/checkAPCACreds/' + userInfo.id).then((response) => {

                response.json().then((data) => {

                    const { APCA_AUTH_STATUS } = data;

                    setAPCA_AUTH_STATUS(APCA_AUTH_STATUS);

                })

            })

        }

    }, [userInfo, setAPCA_AUTH_STATUS])

    if (userInfo !== null) {

        // fetch all data here

        return (

            <div className="account-home">
                {APCA_AUTH_STATUS && (
                    <div>
                        <div className="greeting-blob">
                            <h1 className="greeting">Hey, {userInfo.username}. </h1>
                            <h4 className='greeting-subheading'>Track stocks, make an order or view your portfolio performance, all in one place. </h4>
                        </div>

                        <div className="data-plus-order">
                            <div className='portfolio-hist-component'>
                                <PortfolioHistory />
                            </div>
                            <div className="order-component">
                                <OrderComponent />
                            </div>
                        </div>


                    </div>
                )}

                {!APCA_AUTH_STATUS && (
                    <div>
                        <h1>It appears you are not authenticated with Alpaca.</h1>
                        <p>Please register and retrieve your API Key and Secret Key from Alpaca and enter it here: </p>
                        <AlpacaAuthForm />
                    </div>
                )}
            </div>

        )
    } else {
        return (
            <Navigate to={"/"} />
        )
    }

}