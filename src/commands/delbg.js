const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delbg')
		.setDescription('Delete your Background'),
	async execute(interaction) {
		await interaction.reply('test');
	},
};