// Run this every time you change the commands

const fs = require('fs');
const path = require('path')
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// Get list of files in the commands dir
const commandFiles = fs.readdirSync(path.join(__dirname, "..", "commands")).filter(file => file.endsWith('.js'));

// build json to send to Discord for authorization
const commands = commandFiles.map((file) => {
	const command = require(path.join(__dirname, "..", "commands", file));
    return command.data.toJSON()
})

// Write json to storage for use during bot runtime
fs.writeFileSync(path.join(__dirname, "..", "commands", "commands.json"), JSON.stringify(commands))
const rest = new REST({ version: '9' }).setToken(process.env.token);

// Make auth request to Discord
(async () => {
	try {
		await rest.put(
			Routes.applicationCommands(process.env.clientId),
			{ body: commands },
		);

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
})();
