const tmi = require('tmi.js');
const fs = require('fs');
require('dotenv').config();

const file = './users-list.json';

//INFO: https://dev.twitch.tv/docs/eventsub/handling-webhook-events

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
        'christdickson'
    ]
};

// Create a client with our options
const client = new tmi.client(opts);

client.on('message', onMessageHandler);

// Called every time a message comes in
function onMessageHandler (target, tags, msg, self) {
    if (self) { return; }

    const user = tags.username;

    //TODO: Add checks for subscription level, gifted subscriptions, or channel point purchase




}

//check each user's subscription level
function changeSubLevel() {

}

//If a user earns a request, this will run
export function earnRequest(user) {

}

//If a user spends a request, this will run
export function spendRequest(user) {

}

//refund requests
export function refundRequest(user) {

}

