require('dotenv').config()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const User = require('./models/User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const Alpaca = require('@alpacahq/alpaca-trade-api')


app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json())
app.use(cookieParser())
mongoose.connect(process.env.MONG_CONNECTION_STR).then(() => {

    const salt = bcrypt.genSaltSync(10)
    const secret = "unuewngw0982309tu62308uy6230jt2308t6uy2308ht20th"

    // POST requests
    app.post('/login', async (req, res) => {

        const { username, password } = req.body;

        const userDoc = await User.findOne({ username })

        if (!userDoc) {
            return res.status(400).json({ mssg: "user not valid" })
        }

        const passOk = bcrypt.compareSync(password, userDoc.password)

        if (passOk) {

            // log that mf in 

            jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json({
                    id: userDoc._id,
                    username,
                })
            })

        } else {
            res.status(400).json({ mssg: "incorrect password buddy" })
        }


        console.log("POST: Login Request")

    })

    app.post('/signup', async (req, res) => {

        const { username, password } = req.body;

        try {
            const userDoc = await User.create({
                username,
                password: bcrypt.hashSync(password, salt)
            })
            res.json(userDoc);
        } catch (error) {
            res.status(400).json(error)
        }

        console.log("POST: Registration Request");

    })

    app.post('/logout', (req, res) => {

        res.cookie('token', '').json('ok')

    })

    app.post("/submitorder/:id", async (req, res) => {
        const { id } = req.params

        const {
            ticker,
            numShares,
            buySellStatus,
            timeInForce,
            limitPrice,
            stopPrice
        } = req.body;

        // grab user so we can get alpaca credentials

        // validate id

        try {

            mongoose.Types.ObjectId.isValid(id)

        } catch (error) {

            return res.status(400).json({ mssg: error })

        }

        // get user 

        const user = await User.findById(id);

        if (!user) {

            return res.status(400).json({ mssg: "user invalid" })

        }

        // now have user, grab alpaca credentials
        const apiKey = user.APCA_API_KEY;
        const secretKey = user.APCA_SECRET_KEY

        // if we are at this point, we assume that user is already authenticated

        const options = {
            keyId: apiKey,
            secretKey: secretKey,
            paper: true,
        };

        const alpaca = new Alpaca(options)

        alpaca.createOrder({

            symbol: ticker,
            qty: numShares,
            side: buySellStatus,
            time_in_force: timeInForce,
            type: 'market'

        }).then((response) => {
            console.log('yay')
            res.status(200).json({ mssg: response })
        }).catch((err) => {
            console.log('nay')
            res.status(400).json({ mssg: err })
        })

    })

    app.post('/addtofavs/:id', async (req, res) => {
        const {id} = req.params

        const {ticker} = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ mssg: 'id isnt valid dawg' })
        }

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({mssg: "user init error"})
        }

        // we now have valid user

        User.findOneAndUpdate({_id: id}, {
            $addToSet: {APCA_FAVS: ticker}
        }).then((response) => {
            res.status(200).json({mssg: response})
        }).catch((err) => {
            res.status(400).json({mssg: err})
        })


    })


    // PATCH REQUESTS

    app.patch('/submitAPCAcreds/:id', async (req, res) => {

        // receives id and API key/secret key

        // remember hashing! 

        // checks if API key and secret key is valid --> if not, respond w/ 400 error
        // if both keys are valid, go into database and change key values respectively
        // also set APCA auth status to true in database
        // finally, send 200 response

        const { id } = req.params;

        const { APCA_API_KEY, APCA_SECRET_KEY } = req.body;

        console.log(APCA_API_KEY, APCA_SECRET_KEY)

        // validate id

        try {

            mongoose.Types.ObjectId.isValid(id)

        } catch (error) {

            return res.status(400).json({ mssg: error })

        }

        // get user 

        const user = await User.findById(id);

        if (!user) {

            return res.status(400).json({ mssg: "user invalid" })

        }

        // at this point, we know id and user are valid. now we can get keys/update auth status

        // validate keys and update values

        // instantiate alpaca object

        if (APCA_API_KEY.length === 0 || APCA_SECRET_KEY.length === 0) {
            return res.status(400).json({ mssg: 'invalid credentials' })
        }

        const options = {
            keyId: APCA_API_KEY,
            secretKey: APCA_SECRET_KEY,
            paper: true,
        };

        let alpaca = new Alpaca(options)

        alpaca.getAccount().then((acc) => {

            User.findOneAndUpdate({ _id: id }, {
                APCA_API_KEY: APCA_API_KEY, APCA_SECRET_KEY: APCA_SECRET_KEY, APCA_auth_status: true
            }).then(() => {
                console.log("yay")
                return res.status(200).json({ mssg: "key update successful" })
            }).catch((err) => {
                return res.status(400).json({ mssg: err })
            })

        }).catch((err) => {
            return res.status(400).json({ mssg: err });
        })




    })

    app.patch('/addtoAPCAwatchlist/:id', async (req, res) => {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ mssg: 'id isnt valid dawg' })
        }

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({mssg: "user init error"})
        }


        // VALIDATE TICKER AND ADD TO ALPACA WATCHLIST

        const { ticker } = req.body;

        // add to ALPACA watchlist



        User.findOneAndUpdate({ _id: id }, {
            $push: { APCA_WATCHLIST: ticker }
        }).then(() => {
            res.status(200).json({ mssg: 'watchlist array write successful' })

        }).catch((err) => {

            res.status(400).json({ mssg: 'mongoose error i suppose' })

        })



    })

    app.patch('/changeusername/:id', async (req, res) => {

        const { id } = req.params;

        const {newUsername} = req.body

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ mssg: 'id isnt valid dawg' })
        }

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({mssg: "user init error"})
        }

        // now have validated user, update database entries

        User.findOneAndUpdate({_id: id}, {
            username: newUsername
        }).then((response) => {
            res.status(200).json({mssg: response})
        }).catch((err) => {
            res.status(400).json({mssg: err})
        })

    })

    app.patch("/changepassword/:id", async (req, res) => {

        const { id } = req.params;

        const {newPassword} = req.body

        console.log(id, newPassword)

        const newHashedPassword = bcrypt.hashSync(newPassword, salt)

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ mssg: 'id isnt valid dawg' })
        }

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({mssg: "user init error"})
        }

        User.findOneAndUpdate({_id:id}, {
            password: newHashedPassword
        }).then((response) => {
            res.status(200).json({mssg: response})
        }).catch((err) => {
            res.status(400).json({mssg: err})
        })

    })



    // GET requests

    app.get('/profile', (req, res) => { // access profile data

        const { token } = req.cookies;

        if (token) {
            jwt.verify(token, secret, {}, (err, info) => {
                if (err) throw err;

                res.status(200).json(info);
            })

        } else {

            res.status(400).json({ mssg: 'token error' })

        }
    })


    app.get('/checkAPCACreds/:id', async (req, res) => {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ mssg: 'id isnt valid dawg' })
        }

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({ mssg: 'user not found buddy' })
        }

        res.status(200).json({ APCA_AUTH_STATUS: user.APCA_auth_status });



    })


    app.get("/getperformance/:id", async (req, res) => {

        const { id } = req.params;

        // const {startDate, endDate, period, timeframe, extendedHours} = req.body

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ mssg: 'id isnt valid dawg' })
        }

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({ mssg: "user error" })
        }

        if (user.APCA_API_KEY.length === 0 || user.APCA_SECRET_KEY.length === 0) {
            return res.status(400).json({ mssg: 'invalid credentials' })
        }



        // assuming everything passes, we now have valid id and user
        const options = {
            keyId: user.APCA_API_KEY,
            secretKey: user.APCA_SECRET_KEY,
            paper: true,
        };

        let alpaca = new Alpaca(options)

        alpaca.getPortfolioHistory({

            date_start: new Date("December 17, 1995 03:24:00"),
            date_end: new Date(),
            period: 'intraday',
            timeframe: '1D',
            extended_hours: true

        }).then((response) => {
            res.status(200).json({ response })
        }).catch((err) => {
            res.status(400).json({ mssg: err })
        })



    })

    app.get("/getrecentorders/:id", async (req, res) => {

        const { id } = req.params;

        // const {startDate, endDate, period, timeframe, extendedHours} = req.body

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ mssg: 'id isnt valid dawg' })
        }

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({ mssg: "user error" })
        }

        if (user.APCA_API_KEY.length === 0 || user.APCA_SECRET_KEY.length === 0) {
            return res.status(400).json({ mssg: 'invalid credentials' })
        }



        // assuming everything passes, we now have valid id and user
        const options = {
            keyId: user.APCA_API_KEY,
            secretKey: user.APCA_SECRET_KEY,
            paper: true,
        };

        const alpaca = new Alpaca(options)

        // get recent orders and send back to client

        alpaca.getOrders({
            status: 'all',
            after: new Date("December 17, 1995 03:24:00"),
            until: new Date(),
            direction: 'asc'

        }).then((response) => {
            console.log(response)

            res.status(200).json(response)

        }).catch((err) => {

            console.log(err)

            res.status(400).json({mssg: "alpaca error occured"})

        })

    })

    app.get("/getfavs/:id", async (req, res) => {

        const {id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ mssg: 'id isnt valid dawg' })
        }

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({ mssg: "user error" })
        }

        // we now have valid user

        return res.status(200).json({APCA_FAVS_LIST: user.APCA_FAVS})


    })

    app.get("/getcompanydata/:ticker/:id", async (req, res) => {
        const {ticker, id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ mssg: 'id isnt valid dawg' })
        }

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({ mssg: "user error" })
        }

        // get alpaca info

        if (user.APCA_API_KEY.length === 0 || user.APCA_SECRET_KEY.length === 0) {
            return res.status(400).json({ mssg: 'invalid credentials' })
        }

        const options = {
            keyId: user.APCA_API_KEY,
            secretKey: user.APCA_SECRET_KEY,
            paper: true,
        };

        const alpaca = new Alpaca(options)

        // now have valid alpaca object

        // get company data (request full price history)

        try {
            const bars = alpaca.getBarsV2(ticker, {
                start: "2001-01-01",
                timeframe: alpaca.newTimeframe(1, alpaca.timeframeUnit.DAY),
            })

            const got = [];
            let counter = 1
            for await (let b of bars) {

                got.push({
                    x: b.Timestamp, y: b.ClosePrice
                });

                counter++;
            }
            res.status(200).json({data: got})
        } catch (error) {
            console.log(error)
            res.status(400).json({mssg: "server error"})
        }
          


        
    })

    // DELETE request
    app.delete("/deletefromfavs/:id/:ticker", async (req, res) => {

        const {id, ticker} = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ mssg: 'id isnt valid dawg' })
        }

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({mssg: "user init error"})
        }

        // assume that we will not be sending delete requests for elements that are not in favs array

        User.findOneAndUpdate({_id: id}, {
            $pull: {APCA_FAVS: ticker}
        }).then((response) => {
            res.status(200).json({mssg: response})
        }).catch((err) => {
            res.status(400).json({mssg: err})
        })


    })





    app.listen(process.env.PORT, () => {
        console.log('connected to mongoose and listening on port: ' + process.env.PORT)
    })
}).catch((error) => {
    console.log(error);
})



// mongodb+srv://dhruvarayasam:1I39DUrd644bVsic@stock-trader-database.tatefmn.mongodb.net/?retryWrites=true&w=majority

// 1I39DUrd644bVsic