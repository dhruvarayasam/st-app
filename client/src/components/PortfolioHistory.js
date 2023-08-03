

import { UserContext } from "../contexts/UserContext"
import { useContext, useState, useEffect, useCallback } from "react"
import CanvasJSReact from '@canvasjs/react-stockcharts'
export default function PortfolioHistory() {

    const { userInfo } = useContext(UserContext)

    const [portfolioData, updatePortfolioData] = useState([])

    const [loaded, setLoadedStatus] = useState(true)

    const [favsList, setFavsList] = useState(undefined)

    const [ticker, setTicker] = useState('')
    


    const fetchPortfolioData = useCallback(async () => {

        await fetch(process.env.REACT_APP_DOMAIN_URL+"/getperformance/" + userInfo.id).then(async (res) => {

            const jsonData = await res.json()

            if (res.status === 200) {

                console.log(jsonData)

                let dataArray = []

                for (let i = 0; i < jsonData.response.equity.length; i++) {
                    dataArray.push({ x: i + 1, y: jsonData.response.equity[i] })
                }

                updatePortfolioData(dataArray)
                setLoadedStatus(true)
                console.log(dataArray)

            }

        })

    }, [userInfo])

    const getFavsList = useCallback(async () => {

        if (userInfo.id !== undefined) {

            await fetch("http://localhost:4000/getfavs/" + userInfo.id).then(async (res) => {

                const jsonData = await res.json()

                console.log(jsonData.APCA_FAVS_LIST)

                setFavsList(jsonData.APCA_FAVS_LIST)


            })

        }

    }, [userInfo])

    var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

    const options = {
        animationEnabled: false,
        interactivityEnabled: true,
        zoomEnabled: true,
        backgroundColor: "black",
        charts: [{
            data: [{
                type: "line",
                lineColor: "white",
                dataPoints: portfolioData
            }]
        }]
    };
    const containerProps = {
        width: "100%",
        height: "400px",
        margin: "0",
    };

    function showExampleData() {
        updatePortfolioData([
            { x: new Date("2018-01-01"), y: 71 },
            { x: new Date("2018-02-01"), y: 55 },
            { x: new Date("2018-03-01"), y: 50 },
            { x: new Date("2018-04-01"), y: 65 },
            { x: new Date("2018-05-01"), y: 95 },
            { x: new Date("2018-06-01"), y: 68 },
            { x: new Date("2018-07-01"), y: 28 },
            { x: new Date("2018-08-01"), y: 34 },
            { x: new Date("2018-09-01"), y: 14 },
            { x: new Date("2018-10-01"), y: 71 },
            { x: new Date("2018-11-01"), y: 55 },
            { x: new Date("2018-12-01"), y: 50 },
            { x: new Date("2019-01-01"), y: 34 },
            { x: new Date("2019-02-01"), y: 50 },
            { x: new Date("2019-03-01"), y: 50 },
            { x: new Date("2019-04-01"), y: 95 },
            { x: new Date("2019-05-01"), y: 68 },
            { x: new Date("2019-06-01"), y: 28 },
            { x: new Date("2019-07-01"), y: 34 },
            { x: new Date("2019-08-01"), y: 65 },
            { x: new Date("2019-09-01"), y: 55 },
            { x: new Date("2019-10-01"), y: 71 },
            { x: new Date("2019-11-01"), y: 55 },
            { x: new Date("2019-12-01"), y: 50 }
        ])
    }

    async function handleSubmit(ev) {
        ev.preventDefault()



        if (userInfo.id !== undefined) {

            await fetch("http://localhost:4000/addtofavs/" + userInfo.id, {
                method: "POST",
                body: JSON.stringify({ ticker }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            }).then(async (res) => {

                getFavsList()
                

            }).catch((err) => {

                console.log(err)

            })

        }

    }

    async function deleteTicker(ev) {

        const tick = ev.target.value

        await fetch("http://localhost:4000/deletefromfavs/"+userInfo.id+"/"+tick, {
            method: "DELETE"
        }).then((res) => {
            getFavsList()
        })

    } 

    async function showPortfolioData() {

        setLoadedStatus(false)

        await fetchPortfolioData()

        setLoadedStatus(true)
    }

    async function showCompanyData(e) {

        const ticker = e.target.value;

        // now make request for company data

        setLoadedStatus(false)

        await fetch("http://localhost:4000/getcompanydata/"+ticker+"/"+userInfo.id).then(async (res) => {
            // handle data

            // handle data

            const jsonData = await res.json()

            const dataArray = []

            for (let i = 0; i < jsonData.data.length; i++) {

                let data = jsonData.data[i]

                dataArray.push({x: new Date(data.x), y: data.y})

            }

            updatePortfolioData(dataArray)
            
        })

        setLoadedStatus(true)


    }

    useEffect(() => {

        fetchPortfolioData()
        getFavsList()

    }, [fetchPortfolioData, getFavsList])

    return (
        <div>

            {loaded && (
                <div className="data-window">
                    <div className="chart">
                        <CanvasJSStockChart
                            containerProps={containerProps}
                            options={options} />
                    </div>

                    <ul className="data-window-options">
                        <li><button className="window-options" onClick={showPortfolioData}>Portfolio History</button></li>
                        <li><button className="window-options" onClick={showExampleData}>Example Data</button></li>
                        {favsList !== undefined && (

                            favsList.map((ticker) => {
                                return (
                                    <>
                                        <li><button className="window-options" onClick={showCompanyData} value={ticker}>{ticker}</button>
                                        <button className="delete-ticker" value={ticker} onClick={deleteTicker}>x</button></li>
                                    </>
                                )
                            })
                        )}
                        <li>
                            <form onSubmit={handleSubmit}>

                                <input
                                    type="text"
                                    placeholder="type valid ticker here"
                                    onChange={e => setTicker(e.target.value)}
                                    value={ticker}
                                ></input>

                                <button className="submitButton">add to favs</button>

                            </form>
                        </li>
                    </ul>
                </div>
            )}

            {!loaded && (
                <div>
                    <p>data loading...</p>
                </div>
            )}
        </div>
    )

}