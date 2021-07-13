const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require("axios");
const fs = require('fs');
const mergeImages = require('merge-images');
const {
    Canvas,
    Image
} = require('canvas');
const emojiRegex = require('emoji-regex');

client.login('');

prefix = '+';
k = "";

let commands = fs.readFileSync('commands.json');
commands = JSON.parse(commands);

client.on('message', message => {
    for (let x in commands) {

        embed = new Discord.MessageEmbed()
            .setTitle("botembed")
            .setColor(0x800080);

        if (message.content.startsWith(prefix + x)) {
            console.log("Command used: " + x);
            if (commands[x][0] == "mention") {
                message.mentions.users.forEach(function (user) {
                    k = user.username;
                });

                if (!(k)) {
                    message.channel.send("No mention of user");
                    return false;
                } else {
                    //embed stuff
                    fs.readFile(x + ".txt", 'utf8', function (err, data) {
                        if (err)
                            throw err;
                        var lines = data.split('\n');
                        if (commands[x][1] == undefined) {
                            x = x + "ed";
                        } else {
                            x = commands[x][1];
                        }
                        embed.setTitle(k + ", you got " + x + " by " + message.author.username);
                        embed.setImage(lines[Math.floor(Math.random() * lines.length)]);
                        console.log("Image: " + embed.image.url);
                        message.channel.send({
                            embed
                        });
                        k = "";
                        embed = "";
                        return true;
                    });
                }

            } else {
                switch (x) {
                case "8ball":
                    k = ["Yes", "No", "Take a wild guess...", "Very doubtful", "Sure", "Without a doubt", "senpai, pls no ;-;", "Most likely", "Might be possible", "You'll be the judge", "no... (╯°□°）╯︵ ┻━┻", "no... baka", "don't, it's cringe..."];
                    message.channel.send(":8ball: **Question:** " + message.content.slice(7) + "\n**Answer:** " + k[Math.floor(Math.random() * k.length)]);
                    k = "";
                    return true;
                case "urban":
                    k = "http://api.urbandictionary.com/v0/define?term=" + message.content.slice(7);
                    const getData = async k => {
                        try {
                            const response = await axios.get(k);
                            if (response.data.list.length == 0) {
                                message.channel.send(":no_mouth: `No definition found.`");
                            } else {
                                embed.setTitle("**" + response.data.list[0].word + "**");
                                embed.setDescription(response.data.list[0].definition.replace(/[\[\]']+/g, "") + "\n" + response.data.list[1].definition.replace(/[\[\]']+/g, ""));
                                embed.addField("**Example**", response.data.list[0].example.replace(/[\[\]']+/g, ""));
                                embed.addField("**Example**", response.data.list[1].example.replace(/[\[\]']+/g, ""));
                                embed.addField("**Example**", response.data.list[2].example.replace(/[\[\]']+/g, ""));
                                message.channel.send(embed);
                            }
                            embed.fields = [];
                            return true;
                        } catch (error) {
                            console.log(error);
                            return false;
                        }
                    };
                    getData(k);
                    return true;
                case "ship":
                    k = [];
					names = [];
                    let count = 0;
                    //Check user mention, if there are none or less than 2 check images
                    message.mentions.users.forEach(function (user) {
                        if (count == 2) {
                            return;
                        }
                        k.push(user.id);
						names.push(user.username);
                        count++;
                    });
                    if (k.length <= 1) {
                        message.channel.send("no two mentions");
                        return false;
                    }
                    var img1 = (client.users.cache.get(k[0]).displayAvatarURL({
                            format: 'png',
                            dynamic: false,
                            size: 128
                        }));
                    var img2 = (client.users.cache.get(k[1]).displayAvatarURL({
                            format: 'png',
                            dynamic: false,
                            size: 128
                        }));
                    mergeImages([{
                                src: img1,
                                x: 0,
                                y: 0
                            }, {
                                src: '3.png',
                                x: 128,
                                y: 0
                            }, {
                                src: img2,
                                x: 256,
                                y: 0
                            }
                        ], {
                        width: 384,
                        Canvas: Canvas,
                        Image: Image
                    })
                    .then(function (data) {
                        data = data.replace(/^data:image\/\w+;base64,/, "");
                        data = Buffer.from(data, 'base64');
						names = names[0].substring(0, names[0].length / 2) + names[1].substring(names[1].length / 2);
						message.channel.send("Lovely shipping~\nShip name: **"+ names + "**", { files: [data] });
                    });
				return true;
					case "em":
					// Get emoji TODO: Make unicode emojis expand too
					let regex = /<a:.+?:\d+>|<:.+?:\d+>/g;
					let i = message.content.match(regex);
					//i = i + "," + message.content.match(emojiRegex());
					//i = i.split(",");
					if(i[0] == "null"){ message.channel.send("No emojis"); return true;}
					if(i.length >= 30){ message.channel.send("Too many emojis"); return true;}
					// We get number for link to big resolution of emoji
					regex = /(\d+)/g;
					let emmessage = "";
					i = new Set(i);
					for(let x of i){
					// we check if unicode
						if (x.length !== 1){
						emmessage = emmessage + "https://cdn.discordapp.com/emojis/" + x.match(regex) + ".png?v=1" + "\n"
						}
					}
					message.channel.send(emmessage);
					return true;
					case "addem":
					return true;
					case "removeem":
					return true;
					case "help":
					return true;
                }

            }
        }
    }
});
