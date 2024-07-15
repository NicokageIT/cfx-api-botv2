const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('commands')
    .setDescription('List all available commands and their descriptions'),
  async execute(interaction) {
    try {
      const embed = new EmbedBuilder()
        .setTitle('Available Commands')
        .setDescription('Here is a list of all available commands and their descriptions:')
        .addFields(
          { name: '/status-cfx', value: 'Get the status of all individual Cfx.re components', inline: false },
          { name: '/server-info', value: 'Get server details from a Cfx.re join code', inline: false },
          { name: '/commands', value: 'List all available commands and their descriptions', inline: false },
          { name: '/refresh-status', value: 'Manually refresh the Cfx.re status', inline: false },
          { name: '/news-outage', value: 'Get the current Cfx.re outage status', inline: false },
          { name: '/send-status <channel>', value: 'Send the current FiveM status to a mentioned channel' }
        )
        .setColor(0x00AE86)
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching commands list:', error);
      await interaction.reply('There was an error fetching the commands list. Please try again later.');
    }
  }
};
