const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { poll } = require('../../../lib/util/constants');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: language => language.get('COMMAND_POLL_DESCRIPTION'),
            usage: '<options:string>',
            aliases: ['poll'],
            requiredPermissions: ['EMBED_LINKS']
        });
        this.numbers = poll
    }

    async run(msg, [options]) {
        const opt = options.split(/,\s*/);
        if (opt.length > 10) {
            return msg.send(msg.language.get('COMMAND_POLL_TOO_MANY_OPTIONS'));
        }
        if (opt.length < 2) {
            return msg.send(msg.language.get('COMMAND_POLL_TOO_FEW_OPTIONS'));
        }
        const embed = new MessageEmbed()
            .setColor(msg.guild ? msg.guild.me.displayColor : 'random')
            .setFooter(msg.language.get('COMMAND_POLL_EMBED_FOOTER'));
        for (let idx = 0; idx < opt.length; idx++)
            embed.setDescription(opt.map((option, idx) => `${idx + 1}. ${option}`).join('\n'));

        msg.channel.sendEmbed(embed).then(async message => {
            for (let i = 0; i < opt.length; i++) {
                await message.react(this.numbers[i + 1]);
            }
        });
    }

};
