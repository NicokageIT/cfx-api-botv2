# "cfx-api-botv2" 
This bot uses the cfx-api module released in August 2022 by [Pablo-1610]( https://forum.cfx.re/u/pablo-1610/) on the Cfx.re forum, but without posting a document to date for the use of NodeJS variables, consequently in the last few days I have started studying the source code and have been able to exploit it with good potential.

# issues
I am aware of small errors, such as tags not working or the patreon server's subscription number not showing (au, ar, pla). However, I am continuing to study the module carefully and will get to work on releasing a more innovative version. Furthermore, I am intent on creating a document on gitbook where I can transcribe all the functions made available.

# discord developer site
1. Open [Discord Developer Site](https://discord.com/developers/applications) > New Application
2. Then write a name of your bot, accept tos and click on "create"
3. Now you need to go to the OAuth2 section and click on the "bot" option, in the second box you need to click on the "administrator" option. This will generate an invitation link for your new bot to join your discord server.
4. Next go to the "Bot" section, reset the token to generate one to replace it in the "TOKEN" variable in fivem.js

DISCLAIMER: remember in the "Bot" section to activate all three privileges in "Privileged Gateway Intents"

# how to use
1. Install [NodeJS](https://nodejs.org/en/download/package-manager) --> version 22.4.0
2. Install [Visual Studio Code]()
3. Open JS file, open Terminal, write and run `npm i discord.js cfx-api`
4. Configure fivem.js file in "CHANNEL_ID", "GUILD_ID", "CLIENT_ID"
5. Then reopen terminal and run `node fivem.js`


# available commands
/status-cfx --> generates an embed message with the status of generic cfx.re. It expands in detail when a malfunction is occurring.
/status-individuals-cfx --> generates a detailed embed message with the status of each cfx.re component available at https://status.cfx.re/.
/server-info {code} --> generates an embed message with several fields of server information via the cfx.re/join code

# bonus
I created an event called "checkCfxStatus" which updates via a message in a configurable channel of your choice in the variables above the status of cfx.re. Performs a check every minute. If you want a check every few minutes just enter the following string. If it doesn't work for me, let me know immediately and I will try to fix it. I haven't been able to test it yet as I need to create my own status page bees.

# Contact me on discord if you've had a problem: Nicokage#0 for serious issues




