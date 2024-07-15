const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

// Create a new Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Load commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(path.join(commandsPath, folder)).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, folder, file));
    client.commands.set(command.data.name, command);
  }
}

// Load events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// Log in to Discord
client.login(config.token);

// Periodically check the status every 1 minute
const { checkCfxStatus } = require('./utils/cfxStatus');
setInterval(() => checkCfxStatus(client), 60 * 1000);



































































































































































































































































/*
______               _     _          _   _                 _   _ _           _                            
| ___ \             (_)   | |        | | | |               | \ | (_)         | |                           
| |_/ / __ _____   ___  __| | ___  __| | | |__  _   _      |  \| |_  ___ ___ | | ____ _  __ _  ___         
|  __/ '__/ _ \ \ / / |/ _` |/ _ \/ _` | | '_ \| | | |     | . ` | |/ __/ _ \| |/ / _` |/ _` |/ _ \        
| |  | | | (_) \ V /| | (_| |  __/ (_| | | |_) | |_| |     | |\  | | (_| (_) |   < (_| | (_| |  __/_ _ _   
\_|  |_|  \___/ \_/ |_|\__,_|\___|\__,_| |_.__/ \__, |     \_| \_/_|\___\___/|_|\_\__,_|\__, |\___(_|_|_)  
                                                 __/ |                               __/ |             
                                                |___/                               |___/              
                                                                                                       
                                                                                                       
                                                                                                       
                                                                                                       
                                                                                                       
                                                                                                       
                                                                                                       
                                                                                                       
 _____                            _                                                                    
|_   _|                          (_)                                                                   
  | | _ __     ___ ___  _ __ ___  _ _ __   __ _                                                        
  | || '_ \   / __/ _ \| '_ ` _ \| | '_ \ / _` |                                                       
 _| || | | | | (_| (_) | | | | | | | | | | (_| |_ _ _ _                                                
 \___/_| |_|  \___\___/|_| |_| |_|_|_| |_|\__, (_|_|_|_)                                               
                                           __/ |                                                       
                                          |___/                                                        
                                                                                                       
                                                                                                       
                                                                                                       
                                                                                                       
                                                                                                       
                                                                                                       
                                                                                                       
                                                                                                       
 _ _ _   _       _____       _ _           _   _             _____                              _  _ _ 
( | ) | | |     /  __ \     | | |         | | (_)           /  ___|                            | |( | )
 V V| | | |___  | /  \/ ___ | | | ___  ___| |_ ___   _____  \ `--. _   _ _ __  _ __   ___  _ __| |_V V 
    | | | / __| | |    / _ \| | |/ _ \/ __| __| \ \ / / _ \  `--. \ | | | '_ \| '_ \ / _ \| '__| __|   
    | |_| \__ \ | \__/\ (_) | | |  __/ (__| |_| |\ V /  __/ /\__/ / |_| | |_) | |_) | (_) | |  | |_    
     \___/|___/  \____/\___/|_|_|\___|\___|\__|_| \_/ \___| \____/ \__,_| .__/| .__/ \___/|_|   \__|   
                                                                        | |   | |                      
                                                                        |_|   |_|                      
 */
                                                                                                       
                                                                                                       
                                                                                                       
                                                                                                       

                                                                                                       

// forza napoli sempre e per sempre