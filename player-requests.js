const fs = require('fs');

let users = require('./users-list.json');

/**
 * USER JSON LAYOUT
 * username -> string
 * user_id -> int
 * requests -> int
 * level    -> int
 * daily    -> boolean
 */

export const requests = {
    find: x => users.find(x),
    changeSubLevel,
    earnRequest,
    spendRequest,
    refundRequest,
    checkRequests,
    refreshDailies,
    generateSubs
}

//TODO: add the daily requests check
function checkRequests (username) {
    const user = users.find(x => x.username.toString() === username);

    if(user === null) {
        return 0;
    }
    else {
        return user.requests;
    }
}

//Check each user's subscription level
function changeSubLevel(username, level) {
    const user = users.find(x => x.username.toString() === username);

    user.level = level;

    if(user.level >= 2) {
        user.daily = true;
    }

    users.push(user);
    saveData();
}

//If a user earns a request, this will run
function earnRequest(username) {
    const user = users.find(x => x.username.toString() === username);

    var requestNum = user.requests;
    user.requests = requestNum + 1;
    users.push(user);
    saveData();
}

//If a user spends a request, this will run
function spendRequest(username) {
    const user = users.find(x => x.username.toString() === username);

    var requestNum = user.requests;

    if(user.daily === true) {
        user.daily = false;
        users.push(user);
        saveData();
        return 'Okay';
    }

    else if(checkRequests(username) === 0) {
        return null;
    }

    else {
        user.requests = requestNum - 1;
        users.push(user);
        saveData();
        return 'Okay';
    }
}

//Refund requests
function refundRequest(username) {
    const user = users.find(x => x.username.toString() === username);

    var requestNum = user.requests;

    if(user.level >= 2000) {
        user.daily = true;
        users.push(user);
    }
    else {
        user.requests = requestNum + 1;
        users.push(user);
    }
    saveData();
}

//Refresh Daily Requests for Tier 2+ Users
function refreshDailies() {
    for(const user in users) {
        if (user.level >= 2000) {
            user.daily = true;
            users.push(user);
        }
    }
    saveData();
}

/**
 * USER JSON LAYOUT
 * username -> string
 * user_id -> int
 * requests -> int
 * level    -> int
 * daily    -> boolean
 */

//Generate Subscriber List
function generateSubs(data) {
    const subList = JSON.parse(data);

    for (let i = 0; i < subList.length; i++) {
        const output = subList[i];
        const user = {
            username    = output.user_name,
            user_id     = output.user_id,
            level       = output.tier
        };
        users.push(user);
    }

    saveData();
}


//Save to users-list.json
function saveData() {
    fs.writeFileSync('./users-list.json', JSON.stringify(users, null, 4));
}
