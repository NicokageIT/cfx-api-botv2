const { SlashCommandBuilder } = require('discord.js');
const { checkCfxStatus } = require('../../utils/cfxStatus');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('refresh-status')
    .setDescription('Manually refresh the Cfx.re status'),
  async execute(interaction) {
    try {
      console.log('Manual refresh of Cfx.re status triggered.');
      const embeds = await checkCfxStatus(interaction.client);
      if (embeds.length > 0) {
        await interaction.reply({ content: 'The Cfx.re status has been manually refreshed.', embeds });
      } else {
        await interaction.reply('No status changes detected.');
      }
    } catch (error) {
      console.error('Error refreshing Cfx.re status:', error);
      await interaction.reply('There was an error refreshing the Cfx.re status. Please try again later.');
    }
  }
};
