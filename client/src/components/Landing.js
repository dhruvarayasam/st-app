import Navbar from "./Navbar";

console.log('hit')

export default function Landing() {
    return (
        <div>
            <Navbar />
            <div className="landing-page-content">

                <div className="landing-page-heading">
                    <h2>AN INNOVATIVE NEW TRADING PLATFORM</h2>
                </div>

                <div className="landing-page-spread">
                    <div className="spread-1">
                        <h3>Simplify the trading process.</h3>
                    </div>

                    <div className="spread-2">
                        <h3>Powered by Alpaca Trading API.</h3>
                    </div>
                    <div className="spread-3">
                        <h3>Make an account today.</h3>
                    </div>
                </div>

            </div>
        </div>
    )
}