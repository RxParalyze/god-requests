const tmi = require('tmi.js');
const fs = require('fs');
require('dotenv').config();

const file = './gods-list.json';
const blank = './blank.json';

let blankList = require(blank);
let godsList = require(file);

// Define configuration options
const opts = {
    options: { debug: true },
    connection: {
      secure: true,
      reconnect: true
    },
    identity: {
        username: process.env.USERNAME,
        password: process.env.TWITCH_OAUTH_TOKEN
    },
    channels: [
        'christdickson'
    ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, tags, msg, self) {
  if (self || !msg.startsWith('!')) { return; } // Ignore messages from the bot

  //TODO: Find the user that sent message, see if subscribed
  const user = tags.username;

  const commandName = msg.substring(0,msg.indexOf(':'));
  console.log(`Command name = ${commandName}`);

  // If the command is known, let's execute it
  if (commandName === '!god-request') {
    const god = msg.slice(14);
    queueGod(user, god);
    client.say(target, `${god} added by @${user}`);
    console.log(`* Executed ${commandName} command`);
  }

  else if (commandName === '!god-request-list') {
      //
      const list = getQueue();
      client.say(target, `${list}`);
      console.log(`* Executed ${commandName} command`);
  }

  else if (commandName === '!god-request-next') {
      const nextGod = removeNextQueue();
      client.say(target, `Next God in Queue: ${nextGod}`);
      console.log(`* Executed ${commandName} command`);
  }

  else if (commandName === '!god-request-clear') {
      clearQueue();
      client.say(target, `Queue has been cleared`);
      console.log(`* Executed ${commandName} command`);
  }
}

//Add God to Queue
function queueGod(user, god) {

    const request = {
        user: user,
        god: god
    };

    godsList.push(request);
    saveData();
}

function getQueue() {
    try {
        let output = '';

        for (let i = 0; i < godsList.length; i++) {
            output += `${i+1}. ${godsList[i].god}\n`;
        }

        return output;
    }
    catch(error) {
        console.log(error);
        return 'No gods in queue';
    }

}

function removeNextQueue() {
    try {
        const nextGod = godsList[0].god;
        godsList = godsList.splice(1);
        saveData();

        return JSON.stringify(nextGod);
    }
    catch(error) {
        console.log(error);
        return 'No gods in queue';
    }
}

function clearQueue() {
    fs.writeFileSync(file, JSON.stringify(blankList));
    godsList = blankList;
    saveData();
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

function saveData() {
    fs.writeFileSync(file, JSON.stringify(godsList, null, 4));
}