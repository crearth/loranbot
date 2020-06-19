const tmi = require('tmi.js');
const fetch = require('node-fetch');
require('dotenv').config();

// tmi.js options
const opts = {
  connection: {
    secure: true,
    reconnect: true
  },
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME,
    process.env.CHANNEL_NAME_TWO
  ]
};

// NASA api
const API_KEY = process.env.NASA_API_KEY;
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`;

// create client with the options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// connect to Twitch
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim().toLowerCase();

  // !bidons
  if (commandName === '!bidons') {
    const num = scoreBidons(commandName);
      if (num <= 1) {
        client.say(target, `/me geeft dit maar ${num} bidon, sorry.`);
        console.log(`* Executed ${commandName}`);
      } else {
        client.say(target, `/me geeft dit ${num} bidons.`);
        console.log(`* Executed ${commandName}`);
      }
  }

  // !mars
  if (commandName === '!mars') {
    client.say(target, `Gemiddelde temperatuur vandaag op Mars: ${vandaagTempCelcius}°C.`)
    console.log(`* Executed ${commandName} with a temperature of ${vandaagTempCelcius}°C.`);
  }

  // test
  if (commandName === '!test') {
    client.say(target, 'Ne bidon me water, uniek.');
    console.log(`* Executed ${commandName}`);
  }

}

// aantal bidons berekenen
function scoreBidons () {
  const maxBidons = 5;
  return Math.floor(Math.random() * maxBidons) + 1;
}

// MARS FUNCTIONS

let vandaagTemp
let vandaagTempCelcius
let vandaagSolIndex

// laatste data verkrijgen
getWeather().then(sols => {
  vandaagSolIndex = sols.length - 1
  displayVandaagTemp(sols)
})

// laatste data gemiddelde temperatuur verkrijgen
function displayVandaagTemp(sols) {
  const vandaagSol = sols[vandaagSolIndex]
  vandaagTemp = vandaagSol.avTemp
  vandaagTempCelcius = Math.floor((vandaagTemp - 32) * 5/9)
}

// temp Mars verkrijgen
function getWeather () {
  return fetch(API_URL)
    .then(res => res.json())
    .then(data => {
        const {
          sol_keys,
          validity_checks,
          ...solData
        } = data
      return Object.entries(solData).map(([sol, data]) => {
        return {
          //maxTemp: data.AT.mx,
          //minTemp: data.AT.mn,
          avTemp: data.AT.av
        }
      })
    })
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}