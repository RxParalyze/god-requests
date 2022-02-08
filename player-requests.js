const fs = require('fs');

let users = require('./users-list.json')

/**
 * USER JSON LAYOUT
 * username -> string
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
    refreshDailies
}

function checkRequests (username) {
    const user = users.find(x => x.username.toString() === username);

    if(user === null) {
        return 0;
    }
    else {
        return user.requests;
    }
}

//check each user's subscription level
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

//refund requests
function refundRequest(username) {
    const user = users.find(x => x.username.toString() === username);

    var requestNum = user.requests;

    if(user.level >= 2) {
        user.daily = true;
        users.push(user);
    }
    else {
        user.requests = requestNum + 1;
        users.push(user);
    }
    saveData();
}

function refreshDailies(){
    for(const user in users) {
        if (user.level >= 2) {
            user.daily = true;
            users.push(user);
        }
    }
    saveData();
}

function saveData() {
    fs.writeFileSync('./users-list.json', JSON.stringify(users, null, 4));
}
