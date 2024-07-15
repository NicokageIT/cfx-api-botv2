
const cfx = require('cfx-api');
const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

const STATUS_EMOJIS = {
  operational: '🟢',
  degraded_performance: '🟡',
  partial_outage: '⚫',
  major_outage: '🔴',
  under_maintenance: '⚪'
};

let previousComponentStatus = {};

async function checkCfxStatus(client) {
  try {
    const status = await cfx.fetchStatus();
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

    if (embeds.length > 0) {
      const channel = await client.channels.fetch(config.channelId);
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

async function fetchCfxStatus() {
  const status = await cfx.fetchStatus();
  const components = await status.fetchComponents();
  let statusDetails = '';

  for (let component of components) {
    const emoji = STATUS_EMOJIS[component.status] || '❓';
    statusDetails += `${emoji} **${component.name}**: ${component.status.replace('_', ' ')}\n`;
  }

  return statusDetails;
}

module.exports = {
  checkCfxStatus,
  fetchCfxStatus
};
