const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, AttachmentBuilder } = require('discord.js');
const cfx = require('cfx-api');
const fs = require('fs')
const axios = require('axios')

// Create a new Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });


const TOKEN = 'why_did.you,want:to;spy@on!my°token?'; // Replace with your bot's token
const CHANNEL_ID = '1256200698090225756'; // Replace with your desired channel ID
const CLIENT_ID = '1259088968444674050'; // Replace with your bot's client ID
const GUILD_ID = '1240722591652778075'; // Replace with your server's ID
let previousComponentStatus = {};

// Function to check and send status updates
async function checkCfxStatus() {
  try {
    // Retrieve Cfx.re status
    const status = await cfx.fetchStatus();
    
    // Retrieve status of all individual components
    const components = await status.fetchComponents();
    let currentComponentStatus = {};
    let embeds = [];

    for (let component of components) {
      currentComponentStatus[component.name] = component.status;

      if (previousComponentStatus[component.name] && previousComponentStatus[component.name] !== component.status) {
        const embed = new EmbedBuilder()
          .setTitle('Cfx.re Component Status Update')
          .setDescription(`Component: ${component.name} has changed status.`)
          .addFields(
            { name: 'Previous Status', value: previousComponentStatus[component.name], inline: true },
            { name: 'Current Status', value: component.status, inline: true }
          )
          .setColor(0xFF0000)
          .setTimestamp();

        embeds.push(embed);
      }
    }

    previousComponentStatus = currentComponentStatus;

    // Send the status updates to the channel
    if (embeds.length > 0) {
      const channel = await client.channels.fetch(CHANNEL_ID);
      for (const embed of embeds) {
        await channel.send({ embeds: [embed] });
      }
    }
    
    return embeds;
  } catch (error) {
    console.error('Error fetching Cfx.re component status:', error);
    return [];
  }
}
// Periodically check the status every 1 minute
setInterval(checkCfxStatus, 60 * 1000); // Check status every 1 minute

// Log in to Discord with your bot's token
client.once('ready', () => {
  console.log('Bot is online!');
  registerCommands();
  // Initial check when the bot starts
  checkCfxStatus();
});

// Function to register slash commands
async function registerCommands() {
  const commands = [
    {
      name: 'status-cfx',
      description: 'Get the general Cfx.re status'
    },
    {
      name: 'status-individuals-cfx',
      description: 'Get the status of all individual Cfx.re components'
    },
    {
      name: 'server-info',
      description: 'Get server details from a Cfx.re join code',
      options: [
        {
          name: 'code',
          type: 3, // STRING type
          description: 'The Cfx.re join code',
          required: true,
        },
      ],
    },
    {
      name: 'refresh-status',
      description: 'Manually refresh the Cfx.re status'
    },
    {
      name: 'news-outage',
      description: 'Get the current Cfx.re outage status'
    },
    {
      name: 'commands',
      description: 'List all available commands and their descriptions'
    }
  ];

  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

// Handle interaction events
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'status-cfx') {
    try {
      // Retrieve Cfx.re status
      const status = await cfx.fetchStatus();
      const generalStatus = status.everythingOk ? "All Cfx.re systems are operational" : "Cfx.re is experiencing issues";

      // Create an embed message
      const embed = new EmbedBuilder()
        .setTitle('Cfx.re Status')
        .setDescription(generalStatus)
        .setColor(0x00AE86)
        .setTimestamp();

      // Send the embed message
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching Cfx.re status:', error);
      await interaction.reply('There was an error fetching the Cfx.re status. Please try again later.');
    }
  } else if (commandName === 'status-individuals-cfx') {
    try {
      // Retrieve Cfx.re status
      const status = await cfx.fetchStatus();
      
      // Retrieve status of all individual components
      const components = await status.fetchComponents();
      let componentStatus = '';
      for (let component of components) {
        componentStatus += `${component.name}: ${component.status}\n`;
      }

      // Create an embed message
      const embed = new EmbedBuilder()
        .setTitle('Cfx.re Individual Components Status')
        .setDescription('Status of each Cfx.re component:')
        .addFields(
          { name: 'Components Status', value: componentStatus, inline: false }
        )
        .setColor(0x00AE86)
        .setTimestamp();

      // Send the embed message
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching Cfx.re component status:', error);
      await interaction.reply('There was an error fetching the Cfx.re component status. Please try again later.');
    }
  } else if (commandName === 'server-info') {
    const code = options.getString('code');
    try {
      // Retrieve server details using the provided code
      const server = await cfx.fetchServer(code);

      // Ensure all properties exist
      const hostname = server.hostname || 'N/A';
      const playersCount = server.playersCount || 0;
      const maxPlayers = server.maxPlayers || 0;
      const players = `${playersCount}/${maxPlayers}` || 'N/A';
      const gameType = server.gameType || 'N/A';
      const mapName = server.mapName || 'N/A';
      const enhancedHostSupport = server.enhancedHostSupport ? 'Yes' : 'No';
      const onesyncEnabled = server.isOneSyncEnabled ? 'Yes' : 'No';
      const resources = server.resources ? server.resources.join(', ') : 'N/A';
      const elementClub = server.elementClub || 'None';
      const projectName = server.projectName || 'N/A';
      const projectDesc = server.projectDesc || 'N/A';
      const ownerName = server.ownerName || 'N/A';
      const ownerProfile = server.ownerProfileUrl || 'N/A';
      const ownerAvatar = server.ownerAvatarUrl || 'N/A';
      const supportStatus = server.supported ? 'Yes' : 'No';
      const lastSeen = server.lastSeenDate || 'N/A';
      const tags = server.tags && Array.isArray(server.tags) ? server.tags.join(', ') : 'N/A';

      // Create text files for tags and resources if they exist
      let files = [];
      if (tags !== 'N/A') { // WORKING IN PROGRESS
        const tagsFilePath = './tags.txt';
        fs.writeFileSync(tagsFilePath, tags);
        files.push(new AttachmentBuilder(tagsFilePath));
      }
      if (resources !== 'N/A' && resources.length >= 1024) {
        const resourcesFilePath = './resources.txt';
        fs.writeFileSync(resourcesFilePath, resources);
        files.push(new AttachmentBuilder(resourcesFilePath));
      }
    
      // Create an embed message with server details
      const embed = new EmbedBuilder()
        .setTitle('Cfx.re Server Info')
        .setDescription(`Details for server with code \`${code}\``)
        .addFields(
          { name: 'Hostname', value: hostname, inline: false },
          { name: 'Players', value: players, inline: true },
          { name: 'Gametype', value: gameType, inline: true },
          { name: 'Map', value: mapName, inline: true },
          { name: 'Enhanced Host Support', value: enhancedHostSupport, inline: true },
          { name: 'OneSync Enabled', value: onesyncEnabled, inline: true },
          { name: 'Resources', value: resources.length <= 1024 ? resources : 'See attached file for full list', inline: false },
          { name: 'Server URL', value: `https://cfx.re/join/${code}`, inline: true },
          { name: 'Patreon Level', value: elementClub, inline: true },
          { name: 'Project Name', value: projectName, inline: false },
          { name: 'Project Description', value: projectDesc, inline: false },
          { name: 'Owner Name', value: ownerName, inline: true },
          { name: 'Owner Profile', value: ownerProfile, inline: true },
          { name: 'Owner Avatar', value: ownerAvatar, inline: true },
          { name: 'Support Status', value: supportStatus, inline: true },
          { name: 'Last Seen', value: lastSeen, inline: true },
          { name: 'Tags', value: tags, inline: false }
        )
        .setColor(0x00AE86)
        .setTimestamp();

      // Send the embed message
      await interaction.reply({ embeds: [embed], files: files });
    } catch (error) {
      console.error('Error fetching Cfx.re server info:', error);
      await interaction.reply('There was an error fetching the server info. Please try again later.');
    }
  } else if (commandName === 'commands') {
    try {
      // Create an embed message with the list of commands
      const embed = new EmbedBuilder()
        .setTitle('Available Commands')
        .setDescription('Here is a list of all available commands and their descriptions:')
        .addFields(
          { name: '/status-cfx', value: 'Get the general Cfx.re status', inline: false },
          { name: '/status-individuals-cfx', value: 'Get the status of all individual Cfx.re components', inline: false },
          { name: '/server-info', value: 'Get server details from a Cfx.re join code', inline: false },
          { name: '/commands', value: 'List all available commands and their descriptions', inline: false },
          { name: '/refresh-status', value: 'Manually refresh the Cfx.re status', inline: false },
          { name: '/news-outage', value: 'Get the current Cfx.re outage status', inline: false }
        )
        .setColor(0x00AE86)
        .setTimestamp();

      // Send the embed message
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching commands list:', error);
      await interaction.reply('There was an error fetching the commands list. Please try again later.');
    }
  } else if (commandName === 'refresh-status') {
    try {
      console.log('Manual refresh of Cfx.re status triggered.');
      // Call the checkCfxStatus function to refresh the status
      const embeds = await checkCfxStatus();
      if (embeds.length > 0) {
        await interaction.reply({ content: 'The Cfx.re status has been manually refreshed.', embeds });
      } else {
        await interaction.reply('No status changes detected.');
      }
    } catch (error) {
      console.error('Error refreshing Cfx.re status:', error);
      await interaction.reply('There was an error refreshing the Cfx.re status. Please try again later.');
    }
  } else if (commandName === 'news-outage') {
    try {
      // Fetch incidents using a direct request
      const response = await axios.get('https://status.cfx.re/api/v2/incidents/unresolved.json');
      const incidents = response.data.incidents;
      let incidentDetails = '';

      // Check if there are any incidents
      if (incidents.length > 0) {
        for (let incident of incidents) {
          const affectedComponents = incident.components.map(component => component.name).join(', ');
          const description = incident.body || (incident.incident_updates[0] && incident.incident_updates[0].body) || 'No description available';
          incidentDetails += `**Incident:** ${incident.name}\n**Status:** ${incident.status}\n**Affected Components:** ${affectedComponents}\n**Level:** ${incident.impact}\n**Description:** ${description}\n\n`;
        }

        // Create an embed message
        const embed = new EmbedBuilder()
          .setTitle('Cfx.re Current Outage Status')
          .setDescription('Here are the details of any ongoing incidents:')
          .addFields(
            { name: 'Incidents', value: incidentDetails, inline: false }
          )
          .setColor(0xFF0000)
          .setTimestamp();

        // Send the embed message
        await interaction.reply({ embeds: [embed] });
      } else {
        await interaction.reply('There are no ongoing incidents at this time.');
      }
    } catch (error) {
      console.error('Error fetching Cfx.re incidents:', error);
      await interaction.reply('There was an error fetching the Cfx.re incidents. Please try again later.');
    }
  }
});


// Login to Discord with your bot's token
client.login(TOKEN);




























































































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