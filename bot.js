const Discord = require('discord.js')
const client = new Discord.Client()
const got = require('got')

const {prefix, token} = require('./config.json')

client.once('ready', () => {
    console.log("Running")
    client.user.setActivity("Programming tutorials", {type: 3})
})

async function getARandomJoke() {
    const { body } = await got("https://v2.jokeapi.dev/joke/Programming")
    return JSON.parse(body)
}

async function getChallenge(name) {
    const { body } = await got(`https://www.codewars.com/api/v1/code-challenges/${name}`)
    return JSON.parse(body)
}

async function getUser(name) {
    const { body } = await got(`https://www.codewars.com/api/v1/users/${name}`)
    return JSON.parse(body)
}



client.on('message', (message) => {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();


    if(message.content.startsWith(prefix)) {
        switch(command){    
            case "help":
                const helpEmbed = new Discord.MessageEmbed()
                    .setColor("#99BBAD")
                    .setTitle("Someone called me?")
                    .setDescription("All comand should start with >")
                    .attachFiles("./indian.jpg")    
                    .setThumbnail("attachment://indian.jpg")
                    .addFields(
                        {name: '\u200B', value: '\u200B' },
                        {name: "challenge", value:"Send a challenge from CodeWars.com"},
                        {name: "check", value:"View a profile in CodeWars.com"},

                        {name: "joke", value:"Tell you a random joke about programming"},
                        {name: "call", value:"I call a user"},
                        {name: "team", value:"Make a team with your friends"},
                        )
                    
                message.channel.send({embed: helpEmbed})
                break
    
    
            case "joke":
                getARandomJoke().then((value) => {
                    //so much repeted code? yes
                    //You want to solve ? no
                    if(value.type == "single") {
                        const jokeEmbed = new Discord.MessageEmbed()
                            .setColor("#9A8194")
                            .setTitle("Programming Jokes")
                            .addField(value.joke, "", true)
                        message.channel.send({embed: jokeEmbed})
                    } else {
                        const jokeEmbed = new Discord.MessageEmbed()
                            .setColor("#9A8194")
                            .setTitle("Programming Jokes")
                            .addField(value.setup, value.delivery, true)
                        message.channel.send({embed: jokeEmbed})
                    }
                
                }).catch((error) => {
                    const jokeEmbed = new Discord.MessageEmbed()
                            .setColor("#9A8194")
                            .setTitle("Programming Jokes")
                            .addField("Something Happen", "I'll watch some tutorials", true)
                        message.channel.send({embed: jokeEmbed})
                })
                
                
                break
            
    
            case "challenge":
                
                if(args.length == 0) {
                  
                    const helpEmbed = new Discord.MessageEmbed()
                        .setColor("#EBD8B7")
                        .setTitle("Help Challenge")
                        .addField("The correct usage of this command is", ">challenge [challenge-name]", true)
                    
                    message.channel.send({embed: helpEmbed})
                } else {
                    getChallenge(args[0]).then((value) => {
                        const embed = new Discord.MessageEmbed()
                            .setColor("#EBD8B7")
                            .setTitle(`${value.name} - ${value.rank.name}`)
                            .setDescription(`Total Attempts: ${value.totalAttempts} / Total Completed: ${value.totalCompleted}`)
                            .addField("Description", value.description, false)
                            .addField("Languages", value.languages.splice(0, 11), true)
                            .setTimestamp()    
                            .setFooter(value.url)
                        message.channel.send({embed: embed})
                    }) 
                    .catch((error) => {
                        const embed = new Discord.MessageEmbed()
                            .setColor("#EBD8B7")
                            .setTitle("Error")
                            .addField("404", "Kata not found", true)
                        message.channel.send({embed: embed})
                    })
                    
                }
                break
    
            case "check":
                if(args.length == 0) {          
                    const helpEmbed = new Discord.MessageEmbed()
                        .setColor("#EBD8B7")
                        .setTitle("Help Check")
                        .addField("The correct usage of this command is", ">check [user-name]", false)
                    
                    message.channel.send({embed: helpEmbed})
                } else {    
                    
                    getUser(args[0]).then((value) => {
                        
                        const helpEmbed = new Discord.MessageEmbed()
                        .setColor("#EBD8B7")
                        .setTitle(`${value.username} | ${value.ranks.overall.name} (${value.ranks.overall.score})`)
                        .setDescription(`Name: ${value.name}`)
                        .addFields(
                            {name: "Clã", value: value.clan},
                            {name: "Leaderboard Position", value: value.leaderboardPosition},
                            {name: "Skills", value: value.skills},
                            {name: "Languages", value: Object.keys(value.ranks.languages)},

                        )
                    
                    message.channel.send({embed: helpEmbed})
                    })
                    .catch((error) => {
                        console.log(error)
                        const helpEmbed = new Discord.MessageEmbed()
                        .setColor("#EBD8B7")
                        .setTitle(`Error`)
                        .addField("404", "User not found", false);
                    
                    message.channel.send({embed: helpEmbed})

                    })
                }
                break
            case "team":
                var num = args[args.length - 1]
                var nomes = args.slice(0, args.length - 1)
                let teamEmbed = new Discord.MessageEmbed()
                    .setColor("#EBD8B7")
                    .setTitle("Team making")
                
                if(nomes.length % num === 1) return message.channel.send(`I cant divide this my son`)
                if(num > 5) return message.channel.send("Why you need so much teams? :face_with_raised_eyebrow:")
                if(args == "" || isNaN(num)) {
                    return message.channel.send("I need the names of the people and the number os teams")
                }
                var times = []
                var pessoasPerTimes = nomes.length / num
            
                for(let t = 0 ; t < num; t++){
                    times[t] = []
                    for(let p = 0; p < pessoasPerTimes; p++) {
                        var a = nomes.length - 1
                        var pessoa = nomes[Math.round(Math.random() * a)]
                        times[t].push(pessoa)
                        
                        nomes.splice(nomes.indexOf(pessoa), 1)
                    }
                    //message.channel.send(`Team ${t + 1}\n${times[t].join(" - ")}`)    
                    teamEmbed.addField(`Team ${t + 1}`, `${times[t].join(" - ")}`, false)
                    
                }
                message.channel.send({embed: teamEmbed})
                break
            
            case "call":
                if(!isNaN(args[0]) &&  args[0] <= 5) {
                    for(let i =0; i < args[0]; i++) {
                        message.channel.send(`${args[1]}, Come here son`)
                    }
                }
                break
            
            default:
                return message.channel.send("I du not understanding my son\nTry >help")
        }
    }

    
    return 
})



client.login(process.env.TOKEN)
