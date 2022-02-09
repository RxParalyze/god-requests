# God Request App

This app is intended to enable god requests for a Twitch streamer based on gifted subs and subscription level.

## Requirements
1. You will need a Twitch Dev account. You can enable Twitch Dev with your default account, but it is highly recommended that you create a separate account for your bot.
2. Once logged into dev.twitch.tv, follow the instructions on the [Twitch Authentication Guide](https://dev.twitch.tv/docs/authentication)
3. You will need to create a file named ".env" (without quotes) in the base folder. See the "sampleenv" file for environment variable names. **CAUTION: This file will contain sensitive information! Do not share this with anyone!**

## Installation Instructions for Linux

1. Clone this repo
2. Open Terminal and execute these commands -> ```cd ${HOME}/{your_clone_location}/god-requests}``` -> ```npm install```
3. Run ``` node _app.js ``` in the Terminal. If all steps were performed correctly, you should see a confirmation in the Terminal notifying you that the Bot has successfully connected to the chat.
4. *OPTIONAL:* to begin an automated loop that provides a message to users in the chat, open the stream and type "$loop" (without the quotes) in the chat. You should get confirmation in the Terminal. To end the loop, simply type the same command in the chat.