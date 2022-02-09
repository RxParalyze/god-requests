const tmi = require('tmi.js');
require('dotenv').config();

let loopInterval;

// Define configuration options
const opts = {
    options: { debug: false },
    connection: {
      secure: true,
      reconnect: true
    },
    identity: {
      username: process.env.USERNAME,
      password: process.env.TWITCH_OAUTH_TOKEN
    },
    channels: [
      process.env.CHANNEL
    ]
};

// Create a client with our options
const client = new tmi.client(opts);

client.on('chat', (channel, tags, message, self) => {
    console.log(`Message "${message}" received from ${tags['display-name']}`)
    if (self) return
    const msg = message.split(' ')
    if (msg[0].toLowerCase() === '$loop') {

      if (loopInterval) { // Check if set
        console.log('stop $loop')
        clearInterval(loopInterval) // delete Timer
        loopInterval = false
      } else {
        console.log('start $loop')
        loopInterval = setInterval(function () {
          //client.say(channel, 'Hey there! If you\'re requesting a god, try the new bot!\n!god-request:\n!god-request-list:\n') // client.say(channel, msg[1]) // ?
          client.say(channel, 'I\'m still here. definitely not a bot. :D')
        }, 450000) // 60000ms = 60s = 1min
      }

    }

    for (var x = 0; x < msg.length; x++) {
      if(msg[x] === 'troll') {
        client.say(channel, 'STOP TROLLING YA BUMS')
      }
    }

    if(tags['display-name'] === 'Nightbot') {
      client.say(channel, '!hug @Nightbot')
    }
  })

  client.connect()