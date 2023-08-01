require('dotenv').config()
const Alpaca = require('@alpacahq/alpaca-trade-api');
const { AlpacaBarV2 } = require('@alpacahq/alpaca-trade-api/dist/resources/datav2/entityv2');

const options = {
  keyId: process.env.ALPACA_KEY,
  secretKey: 'wieuiugnewiugewg890we7t',
  paper: true,
}

// async function getBars() {
//   const bars = alpaca.getBarsV2("AAPL", {
//     start: "2022-04-01",
//     end: "2022-04-02",
//     timeframe: alpaca.newTimeframe(30, alpaca.timeframeUnit.MIN),
//   });
//   const got = [];
//   for await (let b of bars) {
//     got.push(b);
//     console.log('yay')
//   }
//   console.log(got);
// }

// getBars()

// try {

//   const alpaca = new Alpaca(options);

//   alpaca.getAccount().then((acc) => {

//   }).catch((err) => {
//     console.log('hit')
//   })

// } catch (error) {
//   console.log(error)
//   console.log('catch')
// }

const apiKey = "ewignewignuewginuewg"
const secret = 'weiubgweiubgwegbou'