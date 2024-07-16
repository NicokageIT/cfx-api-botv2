# "cfx-api-botv2" 
This bot uses the cfx-api module released in August 2022 by [Pablo-1610]( https://forum.cfx.re/u/pablo-1610/) on the Cfx.re forum, but without posting a document to date for the use of NodeJS variables, consequently in the last few days I have started studying the source code and have been able to exploit it with good potential.

# Issues
I am aware of small errors, such as tags not working or the patreon server's subscription number not showing (au, ar, pla). However, I am continuing to study the module carefully and will get to work on releasing a more innovative version. Furthermore, I am intent on creating a document on gitbook where I can transcribe all the functions made available.

# Discord developer site
1. Open [Discord Developer Site](https://discord.com/developers/applications) > New Application
2. Then write a name of your bot, accept tos and click on "create"
3. Now you need to go to the OAuth2 section and click on the "bot" option, in the second box you need to click on the "administrator" option. This will generate an invitation link for your new bot to join your discord server.
4. Next go to the "Bot" section, reset the token to generate one to replace it in the "TOKEN" variable in config.js

> DISCLAIMER: remember in the "Bot" section to activate all three privileges in "Privileged Gateway Intents"

# How to use
1. Install [NodeJS](https://nodejs.org/en/download/package-manager) --> version 22.4.0
2. Install [Visual Studio Code]()
3. Open JS file, open Terminal, write and run `npm i discord.js cfx-api`
4. Configure "CHANNEL_ID", "GUILD_ID", "CLIENT_ID" in config.js file 
5. Then reopen terminal and run `node index.js`


# Available commands + Check event
- **/status-cfx**
Get the status of all individual Cfx.re components
- **/server-info**
Get server details from a Cfx.re join code
- **/commands**
List all available commands and their descriptions
- **/refresh-status**
Manually refresh the Cfx.re status
- **/news-outage**
Get the current Cfx.re outage status
- **/send-status <channel>**
Send the current FiveM status to a mentioned channel

**checkCfxStatus**
I have implemented a check event also regarding the status of Cfx. It works in such a way that if a component's status is updated then it sends an embed log that can be configured to your liking by modifying the channel ID in the CHANNEL_ID variable.

**fetchCfxstatus**
I have implemented another check event for command /send-status. It works in such a way as to check the FiveM API and then give the real-time result of the cfx.re status situation in a better and formatted embed message. 

# Support
Need you support? Contact me on discord for serious issues: Nicokage#0

# Preview Photos
![image](https://github.com/user-attachments/assets/3cdb555e-e141-4cf4-9471-0f44abd7c81e)
![image](https://github.com/user-attachments/assets/3c94a912-8c44-4ce9-84f1-f21b69acff69)
![image](https://github.com/user-attachments/assets/a1594966-f96f-4771-8909-d07e5ba9a282)
![image](https://github.com/user-attachments/assets/d09bc201-b462-4d85-a4c7-e02597644921)
![image](https://github.com/user-attachments/assets/139534c4-7fb7-49fb-b61a-cfaadf83f4e4)
![image](https://github.com/user-attachments/assets/21e8b3f0-cc30-4e14-9362-2a1e931a58a3)
![image](https://github.com/user-attachments/assets/1de38466-4494-4e27-9406-83fae2ddad07)





