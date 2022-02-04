const { Message, Client, MessageAttachment, MessageEmbed } = require("discord.js");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas")
const fs = require("fs");

const width = 600
const height = 600

module.exports = {
    name: "membercount",
    aliases: ['mb'],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const bots = message.guild.members.cache.filter(x => x.user.bot === true).size
        const members = message.guild.members.cache.filter(x => x.user.bot === false).size

        const canvas = new ChartJSNodeCanvas({ width, height, backgroundColour: 'white', })

        const config = {
            labels: [
                `Miembros ${members}`,
                `Bots ${bots}`,
            ],
            datasets: [{
                label: `Miembros del servidor`,
                data: [members, bots],
                backgroundColor: [
                    '#c7f774',
                    '#fc7878'
                ],
                borderColor: '#000000'

            }]
        }

        const data = {
            type: 'pie',
            data: config,
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: `Miembros del server ${message.guild.name}`,
                        padding: {
                            top: 10,
                            bottom: 20
                        }
                    }
                }
            }
        };
        // Crea una carpeta llamada assets
        const image = await canvas.renderToBuffer(data)
        await fs.writeFileSync('assets/grafica.png', image);


        const file = new MessageAttachment('./assets/grafica.png');

        const exampleEmbed = new MessageEmbed()
            .setTitle('Miembros del server')
            .setImage('attachment://grafica.png')
            .setColor('BLACK')
            .setDescription(`**Miembros: \`${members}\`ㅤㅤㅤㅤㅤBots: \`${bots}\`**`)

        message.channel.send({ embeds: [exampleEmbed], files: [file] });

    },
};