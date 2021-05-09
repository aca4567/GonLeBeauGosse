//#region (imports)
const Discord = require('discord.js');
const bot = new Discord.Client();
const token = require("./token.json");
const bdd = require("./bdd.json");
const fs = require('fs');
const fetch = require('node-fetch')
//#endregion

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`); 
    bot.user.setPresence({
        status: 'online',  //dnd, invisible, online, idle 
        activity: {
            name: 'parler Kirua',
            type: 'LISTENING'
        }// WATCHING, LISTENING ou pas type mais url:lien twitch pour STREAMING
})});

bot.on("guildMemberAdd", member => {
    if(bdd["message-bienvenue"]){
        bot.channels.cache.get('838447262601707530').send(bdd[message.guild.id]["message-bienvenue"] + `${member}`);
    }else{
        bot.channels.cache.get("838447262601707530").send(`Bienvenue sur le serveur ${member} !`);
    }
    member.roles.add('839575443984089088');

})

bot.on("message", message => {
    if (message.content.startsWith("Gon.clear")){
        message.delete();
        if(message.member.hasPermission('MANAGE_MESSAGES')){
            
            let args = message.content.trim().split(/ +/g);
            
            if(args[1]){
                if (!isNaN(args[1]) && args[1] >= 1 && args[1] <= 99){

                    message.channel.bulkDelete(args[1])

                }else{
                    message.channel.send("LE NOMBRE NE DOIS PAS ÊTRE UNE CHAINE DE CARACTERE")
                    message.channel.send("le nombre doit être compris entre 0  et 99")                
                }
            }else{
                message.channel.send("Syntax correcte : /clear nombre de message a suprimer")
            }
        }else{
            message.channel.send("Vous n\'avez pas la permission de faire ça !")
        }
    }

    if (message.content.startsWith("Gon.cmb")){
        message.delete();
        if(message.member.hasPermission('MANAGE_MESSAGES')){
            if(message.content.length > 5) {
                message_bienvenue = message.content.slice(8);
                bdd[message.guild.id]["message-bienvenue"] = message_bienvenue;
                const EmbedCmb = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setThumbnail('https://i.skyrock.net/5433/94155433/pics/3276977998_1_2_I9SV0Eld.jpg')
            .addFields(
                { name : `Phrase de Bienvenue changer pour `, value: [message_bienvenue]}
            )
            .setTimestamp()
    
    message.channel.send(EmbedCmb);
                Savebdd();
            }
        }else{
            message.channel.send("Tu n'as pas les permissions")
        }
    }

    if(message.content.startsWith("Gon.warn")) {
        message.delete()
        if(message.member.hasPermission('BAN_MEMBERS')){
            if(!message.mentions.users.first()) return;
            let utilisateur = message.mentions.users.first()
            if (!bdd[message.guild.id]["warn"][utilisateur.id]) {
                bdd[message.guild.id]["warn"][utilisateur.id] = 1;
                Savebdd();
                return message.channel.send(`${utilisateur} a maintenant ${bdd[message.guild.id]['warn'][utilisateur.id]} avertissement.`)
            }
            if (bdd[message.guild.id]["warn"][utilisateur.id] == 2) {
                delete bdd[message.guild.id]["warn"][utilisateur.id]
                Savebdd();
                return message.guild.members.ban(utilisateur);
    
            } else {
                bdd[message.guild.id]["warn"][utilisateur.id]++
                Savebdd();
                return message.channel.send(`${utilisateur} a maintenant ${bdd[message.guild.id]['warn'][utilisateur.id]} avertissements.`)
            }
        }
    }

    if (message.content.startsWith("Gon.kick")) {
        message.delete()
        if(message.member.hasPermission('KICK_MEMBERS')) {
            if(!message.mentions.users.first()) return;
            const utilisateur = message.mentions.users.first()
            const cibleUtilisateur = message.guild.members.cache.get(utilisateur.id)
            bot.channels.cache.get("725822466693267546").send(`${cibleUtilisateur} a étais kick`)
            cibleUtilisateur.kick()
            const EmbedKick = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setThumbnail('https://i.skyrock.net/5433/94155433/pics/3276977998_1_2_I9SV0Eld.jpg')
            .addFields(
                { name : `Kick de ${utilisateurName.username}`, value: `${utilisateurName.username} a étais kick`}
            )
            .setTimestamp()
    
    bot.channels.cache.get("725822466693267546").send(EmbedKick);
        }else{
            message.channel.send("Tu n'as pas les permissions")
        }
    }

    if (message.content.startsWith("Gon.ban")) {
        if(message.member.hasPermission("BAN_MEMBERS")) {
            if(!message.mentions.users.first()) return;
            let utilisateur = message.mentions.users.first().id
            let utilisateurName = message.mentions.users.first()
            let author = message.author
            message.guild.members.ban(utilisateur);
            const EmbedBan = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setThumbnail('https://i.skyrock.net/5433/94155433/pics/3276977998_1_2_I9SV0Eld.jpg')
            .addFields(
                { name : `Ban de ${utilisateurName.username}`, value: `${utilisateurName.username} a étais ban`},
                { name  : `Par :`, value: `${author}`}
            )
            .setTimestamp()
    
    bot.channels.cache.get("839925231367225374").send(EmbedBan);
        }
    }

    if (message.content.startsWith("Gon.help")) {
        const EmbedHelp = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setTitle('Gon Help')
        .setAuthor('aca4567#9222')
        .setThumbnail('https://i.skyrock.net/5433/94155433/pics/3276977998_1_2_I9SV0Eld.jpg')
        .addFields(
            { name : "Gon.clear : ", inline: false, value: "Syntax : Gon.clear <nombres> Cette commande suprime un certain nombre de message"},
            { name : "Gon.cmb : ", inline: false, value: "Syntax : Gon.cmb <Nouvelle phrase> Défini une nouvelle phrase de Bienvenue"},
            { name : "Gon.warn : ", inline: false, value: "Syntax : Gon.warn <mention de l'utilisateur> Donne un avertissement"},
            { name : "Gon.kick : ", inline: false, value: "Syntax : Gon.kick <mention de l'utilisateur> enleve l'utilisateur mentionne du serveur"},
            { name : "Gon.ban : ", inline: false, value: " Syntax : Gon.ban <mention de l'utilisateur> ban l'utilisateur mentionne du serveur"},
            { name : "Gon.userinfo : ", inline: false, value: " Syntax : Gon.userinfo donne des informations sur vous"}
        )
        .setTimestamp()

message.channel.send(EmbedHelp);
    }

    if (message.content.startsWith("Gon.userinfo")) {
        if (message.author.bot) return
        let utilisateurName = message.mentions.users.first()
        let author = message.author
        let utilisateur = author.id
        if (bdd[message.guild.id]["warn"][utilisateur] == undefined) {
            const EmbedUserInfoLogs = new Discord.MessageEmbed()
                .setColor('#00FF00')
                .setThumbnail('https://i.skyrock.net/5433/94155433/pics/3276977998_1_2_I9SV0Eld.jpg')
                .addFields(
                    { name: `Ton pseudo : ${author.username}`, value: '(❁´◡`❁)'},
                    { name: `Ton nombre de warn : 0`, value: '(┬┬﹏┬┬)'}
                )
                .setTimestamp()
        
        message.channel.send(EmbedUserInfoLogs);
        }else{
            let utilisateurName = message.mentions.users.first()
            let author = message.author
            let utilisateur = author.id
            const EmbedUserInfoLogs1 = new Discord.MessageEmbed()
                .setColor('#00FF00')
                .setThumbnail('https://i.skyrock.net/5433/94155433/pics/3276977998_1_2_I9SV0Eld.jpg')
                .addFields(
                    { name: `Ton pseudo : ${author.username}`, value: '(❁´◡`❁)'},
                    { name: `Ton nombre de warn : ${bdd[message.guild.id]["warn"][utilisateur]}`, value: '(┬┬﹏┬┬)'}
                )
                    .setTimestamp()
        
        message.channel.send(EmbedUserInfoLogs1)
        }
    }
})

bot.on("guildCreate", guild => {
    bdd[guild.id] = {}
    bdd[guild.id]["warn"] = {}
    Savebdd()
})

function Savebdd() {
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
        if (err) message.channel.send("Une erreur est survenue. Si le problème persiste contactez mon créateur. (aca4567#9222)");
    });
}

//#region (logs)
// logs commandes
bot.on('message', message => {
    if (message.content.startsWith("Gon.") || message.content.startsWith("!") || message.content.startsWith("/") || message.content.startsWith("z/")) {
        const moment = require('moment')
                moment.locale('fr')
        let author = message.author
        const created = moment(message.createdAt).format('DD/MM/YY');
        const embedlogcommande = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .addFields(
                { name: 'Par :', value: `${author}`},
                { name: 'Contenu de la commande', value: `${message.content}`, inline: false },
                { name: 'Envoyé le', value: `${moment(message.createdAt).format('DD/MM/YYYY HH:mm:ss')}`, inline: false }
            )
            .setTimestamp()

        bot.channels.cache.get('839503169087602708').send(embedlogcommande)
    }
})

// Logs ban
bot.on('message', message => {
    if (message.author.bot) return
    if (message.content.startsWith("Gon.ban")) {
        const moment = require('moment')
                moment.locale('fr')
            let utilisateur = message.mentions.users.first().id
            let utilisateurName = message.mentions.users.first()
            let author = message.author
            const created = moment(message.createdAt).format('DD/MM/YY');
            const EmbedBanLogs = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setThumbnail('https://i.skyrock.net/5433/94155433/pics/3276977998_1_2_I9SV0Eld.jpg')
            .addFields(
                { name : `Ban de ${utilisateurName.username}`, value: `${utilisateurName.username} a étais ban`},
                { name  : `Par :`, value: `${author}`},
                { name: 'Effectué le', value: `${moment(message.createdAt).format('DD/MM/YYYY HH:mm:ss')}`, inline: false },
            )
            .setTimestamp()
    
    bot.channels.cache.get("839925231367225374").send(EmbedBanLogs);
}})

// logs warn
bot.on('message', message => {
    if (message.author.bot) return
    if (message.content.startsWith("Gon.warn")){
const moment = require('moment')
        moment.locale('fr')
        let utilisateur = message.mentions.users.first().id
        let utilisateurName = message.mentions.users.first()
        let author = message.author
        const EmbedWarnLogs = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setThumbnail('https://i.skyrock.net/5433/94155433/pics/3276977998_1_2_I9SV0Eld.jpg')
            .addFields(
                { name: `${utilisateurName.username} c'est pris un warn`, value: `Par : ${author}`},
                { name: 'Le', value: `${moment(message.createdAt).format('DD/MM/YYYY HH:mm:ss')}`, inline: false },
                { name: `${utilisateurName.username} a maintenant `, value: `${bdd[message.guild.id]["warn"][utilisateur]} warn`}
            )
            .setTimestamp()
    
    bot.channels.cache.get("839524640242401311").send(EmbedWarnLogs);
    }
})

// logs messages
bot.on('message', message => {
    if (message.author.bot) return
    if (!message.content.startsWith("/") && !message.content.startsWith("!") && !message.content.startsWith("Gon.")) {
                const moment = require('moment')
                        moment.locale('fr')
                let author = message.author
                const created = moment(message.createdAt).format('D/M/YYYY');
                const embedlogmessage = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .addFields(
                        { name: 'Par :', value: `${author}`},
                        { name: 'Contenu du message :', value: `${message.content}`, inline: false },
                        { name: 'Envoyé le', value: `${moment(message.createdAt).format('DD/MM/YYYY HH:mm:ss')}`, inline: false },
                    )
                    .setTimestamp()

                bot.channels.cache.get('839503096743723019').send(embedlogmessage)
            }
})

// logs MessageUpdates
bot.on('messageUpdate', async (oldMessage, newMessage) => {
    if (!newMessage.content.startsWith("Gon.") || newMessage.content.startsWith("!") || newMessage.content.startsWith("/")) {
        const moment = require('moment')
                 moment.locale('fr')
        let author = newMessage.author
        const created = moment(newMessage.createdAt).format('DD/MM/YY');
        const embedUpdate = new Discord.MessageEmbed()
            .setColor('Couleur')
            .addFields(
                { name: 'Ancien message', value: `${oldMessage.content}` },
                { name: 'Nouveau message', value: `${newMessage.content}` },
                { name: `Chnagé par :`, value: `${author}`},
                { name: 'Changé le', value: `${moment(newMessage.createdAt).format('DD/MM/YYYY HH:mm:ss')}`, inline: false }
            )
            .setTimestamp()

        bot.channels.cache.get('839506917150687233').send(embedUpdate)
    }
})

/*// logs Clear 
bot.on('message', message => {
    if (message.content.startsWith("Gon.clear")) {
        const moment = require('moment')
        moment.locale('fr')
let author = newMessage.author
const created = moment(newMessage.createdAt).format('DD/MM/YY');
const embedClear = new Discord.MessageEmbed()
   .setColor('RANDOM')
   .addFields(
    { name: `${utilisateurName.username} c'est pris un warn`, value: `Par : ${author}`},
    { name: 'Le', value: `${moment(message.createdAt).format('DD/MM/YYYY HH:mm:ss')}`, inline: false },
    { name: `${utilisateurName.username} a maintenant `, value: `${bdd[message.guild.id]["warn"][utilisateur]} warn`}
   )
   .setTimestamp()

bot.channels.cache.get('840727665023123516').send(embedClear)  
    }
})*/
//#endregion
bot.login(process.env.TOKEN);