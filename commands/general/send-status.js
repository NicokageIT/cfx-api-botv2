const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { fetchCfxStatus } = require('../../utils/cfxStatus');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('send-status')
    .setDescription('Send the current FiveM status to a mentioned channel')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to send the status to')
        .setRequired(true)),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    try {
      const statusDetails = await fetchCfxStatus();
      const embed = new EmbedBuilder()
        .setTitle('FiveM Status')
        .setDescription(statusDetails)
        .setColor(0x00AE86)
        .setTimestamp();

      await channel.send({ embeds: [embed] });
      await interaction.reply(`Status sent to ${channel.toString()}`);
    } catch (error) {
      console.error('Error sending status:', error);
      await interaction.reply('There was an error sending the status. Please try again later.');
    }
  }
};
