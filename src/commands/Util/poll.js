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
        this.numbers = {
            1: poll.one,
            2: poll.two,
            3: poll.three,
            4: poll.four,
            5: poll.five,
            6: poll.six,
            7: poll.seven,
            8: poll.eight,
            9: poll.nine,
            10: poll.ten
        };
    }

    async run(msg, [options]) {
        const opt = options.split(', ');
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
