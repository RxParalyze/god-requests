import { requests } from "./player-requests";
import { fetchWrapper } from "./fetch-wrapper";
require('dotenv').config();

const tmi = require('tmi.js');
const fs = require('fs');
const { exec } = require("child_process");

//JSON Files
let blankList = require('./blank.json');
let requestsList = require('./requests-list.json');

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

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

//TODO: Check if user is a Mod, split functions to only allow mods to perform certain functions

// Called every time a message comes in
function onMessageHandler (channel, tags, msg, self) {
  if (self || !msg.startsWith('!')) { return; } // Ignore messages from the bot

  const user = tags.username;

  const commandName = msg.substring(0,msg.indexOf(':'));
  console.log(`Command name = ${commandName}`);

  // If the command is known, let's execute it
  if (commandName === '!god-request') {
    const god = msg.slice(14);
    if (requests.checkRequests(user) > 0) {
        queueGod(user, god);
        requests.spendRequest(user);
        client.say(channel, `${god} added by @${user}`);
    }
    else {
        client.say(channel, `Sorry @${user}, you have no requests remaining.`);
    }
    console.log(`* Executed ${commandName} command`);
  }

  else if (commandName === '!god-request-list') {
      //
      const list = getQueue();
      client.say(channel, `${list}`);
      console.log(`* Executed ${commandName} command`);
  }

  else if (commandName === '!god-request-next') {
      const nextGod = removeNextQueue();
      client.say(channel, `Next God in Queue: ${nextGod}`);
      console.log(`* Executed ${commandName} command`);
  }

  else if (commandName === '!god-request-clear') {
      //TODO: refund all un-used requests
      clearQueue();
      client.say(channel, `Queue has been cleared`);
      console.log(`* Executed ${commandName} command`);
  }

  else if (commandName === '!check-requests') {
    const requestCount = requests.checkRequests(user);
    client.say(channel, `${user} has ${requestCount} remaining requests.`);
    console.log(`* Executed ${commandName} command`);
  }
}

// QUEUE FUNCTIONS

//Add God to Queue
function queueGod(user, god) {

    const request = {
        user: user,
        god: god
    };

    requestsList.push(request);
    saveData();
}

//Retrieve the queued Gods
function getQueue() {
    try {
        let output = '';

        for (let i = 0; i < requestsList.length; i++) {
            output += `${i+1}. ${requestsList[i].god} from @${requestsList[i].user}\n`;
        }

        return output;
    }
    catch(error) {
        console.log(error);
        return 'No gods in queue';
    }

}

//Remove the next God from the Queue
function removeNextQueue() {
    try {
        const nextGod = requestsList[0].god;
        requestsList = requestsList.splice(1);
        saveData();

        return JSON.stringify(nextGod);
    }
    catch(error) {
        console.log(error);
        return 'No gods in queue';
    }
}

//Wipe the queue
function clearQueue() {
    fs.writeFileSync('./requests-list.json', JSON.stringify(blankList));
    requestsList = blankList;
    saveData();
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
    startLoop();
    checkSubscribers();
}


// HELPER FUNCTIONS

//Check all subscribers
function checkSubscribers() {
    const subList = fetchWrapper.get(`subscriptions?broadcaster_id=${process.env.BROADCASTER_ID}`);
    fs.writeFileSync('./users-list.json', JSON.stringify(subList, null, 4));
}

function startLoop() {
    exec("node loop.js", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}

//Save the data
function saveData() {
    fs.writeFileSync('./requests-list.json', JSON.stringify(requestsList, null, 4));
}