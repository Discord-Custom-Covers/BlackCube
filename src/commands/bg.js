const { SlashCommandBuilder, userMention } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const fetch = require('node-fetch');

const urlParams = ["images.unsplash.com", "i.imgur.com", "cdn.discordapp.com", "media.discordapp.net"] // Whitelisted Urls

module.exports = {
	data: new SlashCommandBuilder() // Actual command, referenced for use in other files
		.setName('bg')
		.setDescription('Request a Background')
        .addStringOption(option =>
            option.setName('link')
                .setDescription('Your image link')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('position')
                .setDescription('The position of your image')),
	async execute(interaction) { // Handle interaction from dispatch
        const { user } = interaction

        const blacklisted = interaction.member.roles.cache.some(role => role.name === "BlackCube Blacklist"); // Checks if user has privelege to request
	    if (blacklisted) return interaction.reply({ content: 'You are blacklisted from requesting', ephemeral: true });

        const link = interaction.options.getString('link');
        const pos = interaction.options.getString('position');

        if (pos && pos.toLowerCase() !== "left" && pos.toLowerCase() !== "right") return interaction.reply({ content: 'Invalid position, must be either left or right', ephemeral: true });

        var url

        try { // Check validity of Url before use, also allows for easier parsing
            url = new URL(link)
        } catch {
            return interaction.reply({ content: 'Link is invalid', ephemeral: true })
        }

        if (urlParams.indexOf(url.host) === -1) return interaction.reply({ content: 'Link is not whitelisted', ephemeral: true }) // Check whitelist

        // Fetch image url and check content type to ensure a valid image
        const res = await fetch(url)
        if (res.headers.get("content-type").split("/")[0] !== "image") return interaction.reply({ content: 'Link is not a valid image', ephemeral: true })

        const embed = new MessageEmbed()
            .setColor('#FFFFFF')
            .setAuthor(user.id, user.avatarURL(true))
            .setThumbnail(url)
            .setDescription("Request created for " + userMention(user.id))

        if (pos) embed.setTitle(`Position: ${pos}`)

        // Approve / Deny buttons
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('approve')
                    .setLabel('Approve')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('deny')
                    .setLabel('Deny')
                    .setStyle('DANGER'),
            );

        const logChannel = interaction.guild.channels.cache.find(channel => channel.name === "userbg-log").id;
        const channel = interaction.guild.channels.cache.get(logChannel);
		await interaction.reply({ content: `Your background request has been created and can be viewed in <#${logChannel}>`, ephemeral: true })
        await channel.send({embeds: [embed], components: [row]});
	},
};
