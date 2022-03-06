require('dotenv').config();

const tmi = require('tmi.js');
const fs = require('fs');
const { exec } = require("child_process");

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

//INFO: possible needed commands
//client.isMod(channel, username); -> check if messager is a mod: https://github.com/tmijs/tmi.js/blob/master/lib/client.js, ln 1445

// Connect to Twitch:
client.connect();

//TODO: Check if user is a Mod, split functions to only allow mods to perform certain functions

// Called every time a message comes in
function onMessageHandler (channel, tags, msg, self) {
    if (self) { return; } // Ignore messages from the bot and messages that aren't commands

    const command = msg.split(" ");

    const user = tags.username;

    //const commandName = msg.substring(0,msg.indexOf(':'));

    // If the command is known, let's execute it


    for (var x = 0; x < command.length; x++) {

        if (command[x].toLowerCase() === 'giveaway') {
            client.say(channel, `@${user} retweet from Chris's Twitter, or be subbed and comment at the top of every hour to be entered into the battle royale !giveaway`);
        }

        else if (command[x].toLowerCase() === 'contest') {
            client.say(channel, `@${user} retweet from Chris's Twitter, or be subbed and comment at the top of every hour to be entered into the battle royale !giveaway`);
        }

    }
}


// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}
