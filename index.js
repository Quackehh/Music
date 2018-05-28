const Discord = require("discord.js");
const YTDL = require("ytdl-core")

const TOKEN = "NDQ0NzU1MDY5OTgwNzcwMzE2.Ddgpfg.J79ktK9nT75Cuj4BkN6eIGIsi6s";
const PREFIX = "/";

function play(connection, message){
    var server = servers[message.guild.id];  

    server.dispatcher = connection.playStream(YTDL(server.queue [0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function() {
        if (server.queue[0]) play (connection, message);
        else connection.disconnect()
    });
}

var fortunes = [
    "Yes definitely",
    "Without a doubt",
    "It is decidedly so",
    "It is certain",
    "You may rely on it",
    "As I see it, yes",
    "Most likely",
    "Outlook good",
    "Yes",
    "Signs point to yes",
    "Reply hazy try again",
    "Ask again later",
    "Better not tell you now",
    "Cannot predict now",
    "Concentrate and ask again",
    "Don't count on it",
    "My reply is no",
    "My sources say no",
    "Outlook not so good",
    "Very doubtful"
];

var bot = new Discord.Client();

var servers = {};

bot.on("ready", function() {
    console.log("Ready");
});

bot.on("message", function(message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLowerCase()){
        case "ping":
            message.channel.sendMessage("Pong!:ping_pong:")
            break;
        case "info":
            message.channel.sendMessage("First ever bot created by Ducky");
            break;
        case "8ball":
            if (args[1]) message.channel.sendMessage(fortunes[Math.floor(Math.random() * fortunes.length)]);
            else message.channel.sendMessage("Can't read that.");
            break;
        case "play":
            if (!args[1]) {
                message.channel.sendMessage("Please provide a link");
                return;
            }

            if (!message.member.voiceChannel) { 
                message.channel.sendMessage("You must be in a voice channel")
                return;
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message);
            });
            break;
        case "skip":
            var server = servers[message.guild.id];

            if (server.dispatcher) server.dispatcher.end();
            break;
        case "stop":
            var server = servers[message.guild.id];

            if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
            break;
        default:
    }
});

bot.login(TOKEN);