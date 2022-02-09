require('dotenv').config();

const twitchURL = process.env.TWITCH_URL;
const token = process.env.TWITCH_OAUTH_TOKEN;
const clientID = process.env.CLIENT_ID;

export const fetchWrapper = {
    get,
    post,
    put,
    delete: _delete
};

function get(url) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${twitchURL}${url}`, requestOptions).then(handleResponse);
}

function post(url, body) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        credentials: 'include',
        body: JSON.stringify(body)
    };
    return fetch(`${twitchURL}${url}`, requestOptions).then(handleResponse);
}

function put(url, body) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(body)
    };
    return fetch(`${twitchURL}${url}`, requestOptions).then(handleResponse);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };
    return fetch(`${twitchURL}${url}`, requestOptions).then(handleResponse);
}

// helper functions

function authHeader() {
    return {
        "Authorization": `Bearer ${token}`,
        "Client-Id": `${clientID}`
    };
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);

        return data;
    });
}