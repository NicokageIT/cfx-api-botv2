const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const cfx = require('cfx-api');


const STATUS_EMOJIS = {
  operational: '🟢',
  degraded_performance: '🟡',
  partial_outage: '⚫',
  major_outage: '🔴',
  under_maintenance: '⚪'
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status-cfx')
    .setDescription('Get the status of all individual Cfx.re components'),
  
  async execute(interaction) {
    try {

      // Take Cfx.re status
      const status = await cfx.fetchStatus();

      if (!status) {
        throw new Error('Failed to fetch status from Cfx.re');
      }

      // Take the status of all individuals components
      const components = await status.fetchComponents();

      if (!components || components.length === 0) {
        throw new Error('No components data received');
      }

      let componentStatus = '';
      for (let component of components) {
        const emoji = STATUS_EMOJIS[component.status] || '❓';
        componentStatus += `${emoji} **${component.name}**: ${component.status.replace('_', ' ')}\n`;
      }

      // Make message embed
      const embed = new EmbedBuilder()
        .setTitle('Cfx.re Individual Components Status')
        .setDescription('Status of each Cfx.re component:')
        .addFields(
          { name: 'Components Status', value: componentStatus, inline: false }
        )
        .setColor(0x00AE86)
        .setTimestamp();

      // Send message embed
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching Cfx.re component status:', error.message);
      await interaction.reply('There was an error fetching the Cfx.re component status. Please try again later.');
    }
  }
};
