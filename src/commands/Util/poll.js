const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: language => language.get('COMMAND_POLL_DESCRIPTION'),
            usage: '<options:string>',
            aliases: ['poll'],
            requiredPermissions: ['EMBED_LINKS']
        });
    }

    async run(msg, [options]) {
        const opt = options.split(', ');
        this.numbers = { 1: '1️⃣', 2: '2️⃣', 3: '3️⃣', 4: '4️⃣', 5: '5️⃣', 6: '6️⃣', 7: '7️⃣', 8: '8️⃣', 9: '9️⃣', 10: '🔟'};
        if (options.length > 10) {
            return msg.send('The maximum amount of options is **10**');
        }
        if (options.length < 2) {
            return msg.send('The minimum amount of options required is **2**');
        }
        const embed = new MessageEmbed()
            .setTitle(`${this.client.user.username} poll`)
            .setColor(msg.guild ? msg.guild.me.displayColor : 'ffaabb')
            .setFooter(`React to one of the emotes below to vote.`);
        for (let i = 0; i < opt.length; i++);
        embed.setDescription(opt.map((option, i) => `${i + 1}. ${option}`).join(`\n`));

        msg.channel.sendEmbed(embed).then(async message => {
            for (let i = 0; i < opt.length; i++) {
                await message.react(`${this.numbers[i + 1]}`);
            }
        });
    }

};
