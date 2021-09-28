const { SlashCommandBuilder } = require('@discordjs/builders');
const CRUD = require("../handlers/Database");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delbg')
		.setDescription('Delete your Background'),
	async execute(interaction) {
		const id = interaction.member.id
		if (await CRUD.read(id)) CRUD.del(id)
		await interaction.reply({ content: 'Your background has been removed', ephemeral: true });
	},
};