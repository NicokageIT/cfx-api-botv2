const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const cfx = require('cfx-api');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server-info')
    .setDescription('Get server details from a Cfx.re join code')
    .addStringOption(option => 
      option.setName('code')
        .setDescription('The join code of the server')
        .setRequired(true)),
  async execute(interaction) {
    const code = interaction.options.getString('code');
    try {
      const server = await cfx.fetchServer(code);
      const hostname = server.hostname || 'N/A';
      const playersCount = server.playersCount || 0;
      const maxPlayers = server.maxPlayers || 0;
      const players = `${playersCount}/${maxPlayers}` || 'N/A';
      const gameType = server.gameType || 'N/A';
      const mapName = server.mapName || 'N/A';
      const enhancedHostSupport = server.enhancedHostSupport ? 'Yes' : 'No';
      const onesyncEnabled = server.isOneSyncEnabled ? 'Yes' : 'No';
      const resources = server.resources ? server.resources.join(', ') : 'N/A';
      const projectName = server.projectName || 'N/A';
      const projectDesc = server.projectDesc || 'N/A';
      const ownerName = server.ownerName || 'N/A';
      const ownerProfile = server.ownerProfileUrl || 'N/A';
      const ownerAvatar = server.ownerAvatarUrl || 'N/A';
      const supportStatus = server.supported ? 'Yes' : 'No';
      const lastSeen = server.lastSeenDate || 'N/A';

      let files = [];
      if (resources !== 'N/A' && resources.length >= 1024) {
        const resourcesFilePath = './resources.txt';
        fs.writeFileSync(resourcesFilePath, resources);
        files.push(new AttachmentBuilder(resourcesFilePath));
      }

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
          { name: 'Project Name', value: projectName, inline: false },
          { name: 'Project Description', value: projectDesc, inline: false },
          { name: 'Owner Name', value: ownerName, inline: true },
          { name: 'Owner Profile', value: ownerProfile, inline: true },
          { name: 'Owner Avatar', value: ownerAvatar, inline: true },
          { name: 'Support Status', value: supportStatus, inline: true },
          { name: 'Last Seen', value: lastSeen, inline: true },
        )
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.avatarURL() })
        .setThumbnail(ownerAvatar)
        .setColor(0x00AE86)
        .setTimestamp();

      await interaction.reply({ embeds: [embed], files: files });
    } catch (error) {
      console.error('Error fetching Cfx.re server info:', error);
      await interaction.reply('There was an error fetching the server info. Please try again later.');
    }
  }
};
