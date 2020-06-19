const tmi = require('tmi.js');
require('dotenv').config();

// Define configuration options
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

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}