import { useContext, useState, useCallback, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";



export default function OrderComponent() {

    const { userInfo } = useContext(UserContext);


    const [orderData, setOrderData] = useState([])
    const [inputInfo, setInputInfo] = useState({
        ticker:"AAPL",
        numShares:"1",
        buySellStatus:"buy",
        timeInForce:"day",
        limitPrice:undefined,
        stopPrice:undefined 
    })
    const [responseStatus, setResponseStatus] = useState(undefined)

    const fetchRecentOrderData = useCallback(async () => {

        await fetch("http://localhost:4000/getrecentorders/" + userInfo.id).then(async (res) => {

            const jsonData = await res.json()

            setOrderData(jsonData)

        })

    }, [userInfo])

    useEffect(() => {
        fetchRecentOrderData()
    }, [fetchRecentOrderData])

    function changeHandler(e) {

        setInputInfo({
            ...inputInfo,
            [e.target.name]: e.target.value
        })

    }

    async function handleSubmit(ev) {
        ev.preventDefault()

        const response = await fetch("http://localhost:4000/submitorder/"+userInfo.id, {
            method:"POST",
            body: JSON.stringify(inputInfo),
            headers: {'Content-Type':'application/json'},
        })

        if (response.ok) {
            setResponseStatus(true)
            fetchRecentOrderData()
        } else if (!response.ok) {
            setResponseStatus(false)
        }



    } 


    return (
        <div className="order-blob">

            <div className="order-form">
                <h3>Submit Order</h3>
                <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder='ticker'
                        name="ticker"
                        value={inputInfo.ticker}
                        onChange={changeHandler}
                    ></input>
                    <input
                        placeholder='num of shares'
                        name="numShares"
                        type="number"
                        value={inputInfo.numShares}
                        onChange={changeHandler}
                    ></input>
                    <label>order side</label>
                    <select
                        name="buySellStatus"
                        value={inputInfo.buySellStatus}
                        onChange={changeHandler}
                        >
                        <option value="buy">buy</option>
                        <option value="sell">sell</option>
                    </select>
                    <label>time in force</label>
                    <select
                        name="timeInForce"
                        value={inputInfo.timeInForce}
                        onChange={changeHandler}
                        >
                        <option value="day">day</option>
                        <option value="gtc">gtc</option>
                        <option value="opg">opg</option>
                        <option value="ioc">ioc</option>
                    </select>
                    <button>submit</button>
                    {responseStatus && (
                        <div>
                            <h1>Order submitted successfully.</h1>
                        </div>
                    )}
                    {responseStatus !== undefined && responseStatus === false && (
                        <div>
                            <h1>Order failed.</h1>
                        </div>
                    )}
                </div>
                        </form>
            </div>

        <div className="order-history">
        <h3>Order History</h3>
            {orderData && (
                orderData.map((el) => {
                    return (<p>{el.symbol + ": "+ el.qty+" shares"}</p>)
                })
            )}
        </div>
        </div>
    )



}