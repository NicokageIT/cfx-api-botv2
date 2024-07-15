const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('news-outage')
    .setDescription('Get the current Cfx.re outage status'),
  async execute(interaction) {
    try {
      const response = await axios.get('https://status.cfx.re/api/v2/incidents/unresolved.json');
      const incidents = response.data.incidents;
      let incidentDetails = '';

      if (incidents.length > 0) {
        for (let incident of incidents) {
          const affectedComponents = incident.components.map(component => component.name).join(', ');
          const description = incident.body || (incident.incident_updates[0] && incident.incident_updates[0].body) || 'No description available';
          incidentDetails += `**Incident:** ${incident.name}\n**Status:** ${incident.status}\n**Affected Components:** ${affectedComponents}\n**Level:** ${incident.impact}\n**Description:** ${description}\n\n`;
        }

        const embed = new EmbedBuilder()
          .setTitle('Cfx.re Current Outage Status')
          .setDescription('Here are the details of any ongoing incidents:')
          .addFields({ name: 'Incidents', value: incidentDetails, inline: false })
          .setColor(0xFF0000)
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      } else {
        await interaction.reply('There are no ongoing incidents at this time.');
      }
    } catch (error) {
      console.error('Error fetching Cfx.re incidents:', error);
      await interaction.reply('There was an error fetching the Cfx.re incidents. Please try again later.');
    }
  }
};
