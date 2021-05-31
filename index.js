//#region (imports)
const Discord = require('discord.js');
const bot = new Discord.Client();
const token = require("./token.json");
const bdd = require("./bdd.json");
const fs = require('fs');
const fetch = require('node-fetch')
//#endregion

//#region (Démarage/Join)
bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`); 
    bot.user.setPresence({
        status: 'online',  //dnd, invisible, online, idle 
        activity: {
            name: 'Kirua',
            type: 'WATCHING'
        }// WATCHING, LISTENING ou pas type mais url:lien twitch pour STREAMING
})});

bot.on("guildCreate", guild => {
    bdd[guild.id] = {}
    bdd[guild.id]["Prefix"] = "Gon"
    bdd[guild.id]["warn"] = {}
    bdd[guild.id]["members"] = {}
    bdd[guild.id]["afk"] = {}
    Savebdd()
})

bot.on("guildMemberAdd", member => {
    if(bdd[member.guild.id]["message-bienvenue"]){
        bot.channels.cache.get(bdd[member.guild.id]["channel_msg_bienvenue"]).send(bdd[member.guild.id]["message-bienvenue"] + `${member}`);
    }

    member.roles.add(bdd[member.guild.id]["start_roles"]["id"]);

    bdd[member.guild.id]["members"][member.displayName] = member.id
    Savebdd()
})

//#endregion

//#region (commandes)
bot.on("message", message => {

    if (message.content.startsWith(bdd[message.guild.id]["Prefix"] + ".CPrefix")) {
        if (message.member.hasPermission("ADMINISTRATOR")) {
            PrefixLen = bdd[message.guild.id]["Prefix"].length
            LenCommande = PrefixLen + 9
            message_Prefix = message.content.slice(LenCommande)
            bdd[message.guild.id]["Prefix"] = message_Prefix
            Savebdd()
        }else{
            message.channel.send("Vous n\'avez pas la permission de faire ça !")
        }

    }

//#region (Administration)

    if (message.content.startsWith(bdd[message.guild.id]["Prefix"] + ".clear")) {
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

    if (message.content.startsWith(bdd[message.guild.id]["Prefix"] + ".cmb")) {
        if (message.member.hasPermission('MANAGE_MESSAGES')){
            if (message.content.length > 7) {
                PrefixLen = bdd[message.guild.id]["Prefix"].length
                LenCommande = PrefixLen + 5
                message_bienvenue = message.content.slice(LenCommande)
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
            }else{
                message.channel.send("Syntax : Gon.cmb <Phrase de Bienvenue>")
            }
        }else{
            message.channel.send("Vous n\'avez pas la permission de faire ça !")
        }
    }

    if(message.content.startsWith(bdd[message.guild.id]["Prefix"] + ".warn")) {
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
                bdd[message.guild.id]["members"][utilisateur.id] = {}
                Savebdd();
                return message.guild.members.ban(utilisateur);
    
            } else {
                bdd[message.guild.id]["warn"][utilisateur.id]++
                Savebdd();
                return message.channel.send(`${utilisateur} a maintenant ${bdd[message.guild.id]['warn'][utilisateur.id]} avertissements.`)
            }
        }else{
            message.channel.send("Vous n\'avez pas la permission de faire ça !")
        }
    }

    if (message.content.startsWith(bdd[message.guild.id]["Prefix"] + ".kick")) {
        if(message.member.hasPermission('KICK_MEMBERS')) {
            if(!message.mentions.users.first()) return;
            let utilisateur = message.mentions.users.first()
            let cibleUtilisateur = message.guild.members.cache.get(utilisateur.id)
            bot.channels.cache.get("725822466693267546").send(`${cibleUtilisateur} a étais kick`)
            cibleUtilisateur.kick()
            const EmbedKick = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setThumbnail('https://i.skyrock.net/5433/94155433/pics/3276977998_1_2_I9SV0Eld.jpg')
            .addFields(
                { name : `Kick de ${utilisateur.username}`, value: `${utilisateur.username} a étais kick`}
            )
            .setTimestamp()
    
    message.channel.send(EmbedKick);
        }else{
            message.channel.send("Vous n\'avez pas la permission de faire ça !")
        }
    }

    if (message.content.startsWith(bdd[message.guild.id]["Prefix"] + ".ban")) {
        if(message.member.hasPermission("BAN_MEMBERS")) {
            if(!message.mentions.users.first()) return;
            let utilisateur = message.mentions.users.first().id
            let utilisateurName = message.mentions.users.first().username
            let author = message.author
            Savebdd()
            message.guild.members.ban(utilisateur);
            const EmbedBan = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setThumbnail('https://i.skyrock.net/5433/94155433/pics/3276977998_1_2_I9SV0Eld.jpg')
            .addFields(
                { name : `Ban de ${utilisateurName}`, value: `${utilisateurName} a étais ban`},
                { name  : `Par :`, value: `${author}`}
            )
            .setTimestamp()
    
    bot.channels.cache.get("839925231367225374").send(EmbedBan);
        }else{
            message.channel.send("Vous n\'avez pas la permission de faire ça !")
        }
    }

    if (message.content.startsWith(bdd[message.guild.id]["Prefix"] + ".unban")) {
        if(message.member.hasPermission("BAN_MEMBERS")) {
                PrefixLen = bdd[message.guild.id]["Prefix"].length
                LenCommande = PrefixLen + 7
                unban = message.content.slice(LenCommande)
                message.guild.members.unban(bdd[message.guild.id]["members"][unban])
                delete message.guild.members.unban(bdd[message.guild.id]["members"][unban])
                Savebdd()
                const EmbedUnban = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setThumbnail('https://i.skyrock.net/5433/94155433/pics/3276977998_1_2_I9SV0Eld.jpg')
            .addFields(
                { name : `Unban de ${unban}`, value: `${unban} a étais Unban`},
            )
            .setTimestamp()
    
    message.channel.send(EmbedUnban);                  
        }else{
            message.channel.send("Vous n\'avez pas la permission de faire ça !")
        }
    }

    if (message.content.startsWith(bdd[message.guild.id]["Prefix"] + ".role_start")) {
        if(message.member.hasPermission("ADMINISTRATOR")) {
                PrefixLen = bdd[message.guild.id]["Prefix"].length
                LenCommande = PrefixLen + 12
                Role = message.content.slice(LenCommande)
                myRole = message.guild.roles.cache.find(role => role.name === Role)
                bdd[message.guild.id]["start_roles"] = {"name":myRole["name"],"id":myRole["id"]}
                Savebdd()
                const EmbedrolesStart = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setThumbnail('https://i.skyrock.net/5433/94155433/pics/3276977998_1_2_I9SV0Eld.jpg')
            .addFields(
                { name : `Roles de départ changé pour : `, value: bdd[message.guild.id]["start_roles"]["name"]}
            )
            .setTimestamp()
    
    message.channel.send(EmbedrolesStart);
        }else{
            message.channel.send("Vous n\'avez pas la permission de faire ça !")
        }
    }

    if (message.content.startsWith(bdd[message.guild.id]["Prefix"] + ".channel_msg_Bienvenue")) {
        if (message.member.hasPermission("ADMINISTRATOR")) {
            PrefixLen = bdd[message.guild.id]["Prefix"].length
            LenCommande = PrefixLen + 24
            channel = message.content.slice(LenCommande)
            bdd[message.guild.id]["channel_msg_bienvenue"] = channel
            Savebdd()
            const EmbedBienvenue = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setThumbnail('https://i.skyrock.net/5433/94155433/pics/3276977998_1_2_I9SV0Eld.jpg')
            .addFields(
                { name : `Channel de msg bienvenue changé pour : `, value: bdd[message.guild.id]["channel_msg_bienvenue"]}
            )
            .setTimestamp()
    
    message.channel.send(EmbedBienvenue);
        }else{
            message.channel.send("Vous n\'avez pas la permission de faire ça !")
        }
    }

//#endregion

//#region (public)

    if (message.content.startsWith(bdd[message.guild.id]["Prefix"] + ".help")) {
        const EmbedHelp = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setTitle('Gon Help')
        .setAuthor('aca4567#9222')
        .setThumbnail('https://i.skyrock.net/5433/94155433/pics/3276977998_1_2_I9SV0Eld.jpg')
        .addFields(
            { name : `${bdd[message.guild.id]["Prefix"]}.clear : `, inline: false, value: `Syntax : ${bdd[message.guild.id]["Prefix"]}.clear <nombres> Cette commande suprime un certain nombre de message`},
            { name : `${bdd[message.guild.id]["Prefix"]}.cmb : `, inline: false, value: `Syntax : ${bdd[message.guild.id]["Prefix"]}.cmb <Nouvelle phrase> Défini une nouvelle phrase de Bienvenue`},
            { name : `${bdd[message.guild.id]["Prefix"]}.warn : `, inline: false, value: `Syntax : ${bdd[message.guild.id]["Prefix"]}.warn <mention de l'utilisateur> Donne un avertissement`},
            { name : `${bdd[message.guild.id]["Prefix"]}.kick : `, inline: false, value: `Syntax : ${bdd[message.guild.id]["Prefix"]}.kick <mention de l'utilisateur> enleve l'utilisateur mentionne du serveur`},
            { name : `${bdd[message.guild.id]["Prefix"]}.ban : `, inline: false, value: `Syntax : ${bdd[message.guild.id]["Prefix"]}.ban <mention de l'utilisateur> ban l'utilisateur mentionne du serveur`},
            { name : `${bdd[message.guild.id]["Prefix"]}.userinfo : `, inline: false, value: `Syntax : ${bdd[message.guild.id]["Prefix"]}.userinfo donne des informations sur vous`},
            { name : `${bdd[message.guild.id]["Prefix"]}.channel_msg_Bienvenue`, inline: false, value: `Syntax : ${bdd[message.guild.id]["Prefix"]}.channel_msg_Bienvenue <id du channel> change le salon d'envoie du msg de bienvenue`},
            { name : `${bdd[message.guild.id]["Prefix"]}.role_start`, inline: false, value: `Syntax : ${bdd[message.guild.id]["Prefix"]}.role_start <Nom du rôle> change le rôle que l'utilisateur a quand il rejoint le serveur`},
            { name : `${bdd[message.guild.id]["Prefix"]}.afk`, inline: false, value: `Syntax : ${bdd[message.guild.id]["Prefix"]}.afk <Motif> si un joueur vous mentionne il sera prévenu que vous êtes afk`},
            { name : `${bdd[message.guild.id]["Prefix"]}.Gon.offafk`, inline: false, value: `Syntax : ${bdd[message.guild.id]["Prefix"]}.offafk désactive le mode afk`},
            { name : `${bdd[message.guild.id]["Prefix"]}.CPrefix`, inline: false, value: `Syntax : ${bdd[message.guild.id]["Prefix"]}.CPrefix <Nouveau Préfix> change le Préfix du bot`}
        )

        .setFooter("Comment avoir l'id de quelque chose cliqué sur le titre de l'embed")
        .setURL("https://support.discord.com/hc/fr/articles/206346498-O%C3%B9-trouver-l-ID-de-mon-compte-utilisateur-serveur-message-")
        .setTimestamp()

message.channel.send(EmbedHelp);
    }

    if (message.content.startsWith(bdd[message.guild.id]["Prefix"] + ".userinfo")) {
        let author = message.author
        let utilisateur = author.id
        if (bdd[message.guild.id]["warn"][utilisateur] == undefined) {
            const EmbedUserInfoLogs = new Discord.MessageEmbed()
                .setColor('#00FF00')
                .setThumbnail('https://i.skyrock.net/5433/94155433/pics/3276977998_1_2_I9SV0Eld.jpg')
                .addFields(
                    { name: `Ton pseudo : ${author.username}`, value: '(❁´◡`❁)'},
                    { name: `Ton nombre de warn : 0`, value: '(┬┬﹏┬┬)'},
                    { name: `Ton tag ${author.tag}`, value: '╰(*°▽°*)╯'},
                )
                .setTimestamp()
        console.log(author.username)
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
                    { name: `Ton nombre de warn : ${bdd[message.guild.id]["warn"][utilisateur]}`, value: '(┬┬﹏┬┬)'},
                    { name: `Ton tag ${author.tag}`, value: '╰(*°▽°*)╯'},
                    { name: `Tes rôles : ${message.member.roles}`}
                )
                    .setTimestamp()
        
        message.channel.send(EmbedUserInfoLogs1)
        }
    }

//#endregion

//#region (salut)

    if (message.content.startsWith("Salut !") || message.content.startsWith("salut") || message.content.startsWith("Salut") || message.content.startsWith("salut !")) {
        message.react("👋")
    }

//#endregion

//#region (pseudo)

    /*if (message.content.startsWith(bdd[message.guild.id]["Prefix"] + ".reload")) {
        if (!message.member.displayName.includes("aca4567")) {
            if(!message.member.displayName.includes(message.member.roles.highest.name)){   
                message.member.setNickname(message.member.user.username)
                message.member.setNickname("『" + message.member.roles.highest.name + "』" + message.member.user.username)  
            }
        }
    }*/

    if (message.content.includes("a")) {
        if (!message.member.displayName.includes("aca4567")) {
            if(!message.member.displayName.includes(message.member.roles.highest.name)){   
                message.member.setNickname(message.member.user.username)
                message.member.setNickname("『" + message.member.roles.highest.name + "』" + message.member.user.username)
            }
        }
    }

//#endregion

//#region (afk)

    if (bdd[message.guild.id]["afk"][message.author.username]) {
        if (!message.content.startsWith("Gon.afk")) {         
            delete bdd[message.guild.id]["afk"][message.author.username]
                const EmbedOffAfkM = new Discord.MessageEmbed()
                .setColor('RANDOM')
                //.setThumbnail('https://i.skyrock.net/5433/94155433/pics/3276977998_1_2_I9SV0Eld.jpg')
                .addFields(
                    { name: `${message.author.username} n'est plus afk`, value: "(⩾__⩽)"},
                )
                .setTimestamp()
        
            message.channel.send(EmbedOffAfkM);
                Savebdd()
        }
    }

    if (message.content.startsWith(bdd[message.guild.id]["Prefix"] + ".afk")) {
        if (message.content.length > 7) {
            if (!bdd[message.guild.id]["afk"][message.author.username]) {
                message_afk = message.content.slice(8)
                bdd[message.guild.id]["afk"][message.author.username] = message_afk
                const EmbedAfk = new Discord.MessageEmbed()
                .setColor('RANDOM')
                //.setThumbnail('https://i.skyrock.net/5433/94155433/pics/3276977998_1_2_I9SV0Eld.jpg')
                .addFields(
                    { name: `${message.author.username} est afk`, value: "(⩾﹏⩽)"},
                    { name: `Motif :`, value: `${message_afk}`}
                )
                .setTimestamp()
        
        message.channel.send(EmbedAfk);
                Savebdd()
            }else{
                message.channel.send(`${message.member} Vous êtes déja afk !`)
            }
        }   
    }

    if(message.mentions.users.first()) {
        if (bdd[message.guild.id]["afk"][message.mentions.users.first().username]) {
            if (message.content.startsWith("Gon.afk")) {
                message.channel.bulkDelete(1)
                const EmbedAfkMention = new Discord.MessageEmbed()
                .setColor('RANDOM')
                //.setThumbnail('https://i.skyrock.net/5433/94155433/pics/3276977998_1_2_I9SV0Eld.jpg')
                .addFields(
                    { name: `${message.mentions.users.first().username} est afk`, value: "(⩾﹏⩽)"},
                    { name: `Motif :`, value: `${bdd[message.guild.id]["afk"][message.mentions.users.first().username]}`}
                )
                .setTimestamp()
        
                message.channel.send(EmbedAfkMention);
            }
        }
    }
//#endregion
})
//#endregion

//#region (SaveBdd/Login)
function Savebdd() {
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
        if (err) message.channel.send("Une erreur est survenue. Si le problème persiste contactez mon créateur. (aca4567#9222)");
    });
}
bot.login(process.env.TOKEN);

//#endregion