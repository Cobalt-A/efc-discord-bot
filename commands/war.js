module.exports = async (bot,message,args,argsF) => {
    //args - это массив аргументов. Например g/ping 0 1 2 tEsT | args[0]="0", args[1]="1", args[2]="2", args[3]="test" . А так-же argsF[3]=="tEsT"
    
    const {guild} = message
    const {Memory} = bot
    const memGuild = Memory.guilds.get(guild.id)
    const agressorRole = message.guild.roles.cache.find(role => role.id === args.agressor);
    const userRolesId = message.member._roles
    const userRoles = userRolesId.map((el) => {
        const result = message.guild.roles.cache.find(role => role.id === el)
        return result.name
    })

    const isComander = userRoles.find((el) => !el.indexOf('Глава') ? 1 : 0 );
    const inGroup = userRoles.find((el) => !el.indexOf(agressorRole.name) ? 1 : 0 );

    // если есть обьект с этими ролями записать его
    const object = memGuild.wars.filter((obj) => {
        return obj.groups.find((el) => el == args.agressor) && obj.groups.find((el) => el == args.defensive)
    })[0]

    // является ли пользователь главой этой группировки
    if (!isComander || !inGroup) {
        return message.reply({
            content: `Вы не являетесь главой группировки <@&${args.agressor}>`,
            ephemeral: true
        })
    }

    // если в бд группы из этих 2-х ролей нет, они запишутся в бд с статусом войны
    if (!object) {
        memGuild.wars.push({
            groups: [args.agressor, args.defensive],
            agressor: args.agressor,
            defensive: args.defensive,
            invater: null, 
            accepter: null, 
            status: 'war',
            pieceInvate: null,
            unionInvate: null
        })
        Memory.save()
        return message.reply({
            content: `Группировка <@&${args.agressor}> теперь в войне с группировкой <@&${args.defensive}>`
        })
    }

    // если есть союз
    if (object.status == 'union') {
        return message.reply({
            content: `Война не возможна, группировка <@&${args.agressor}> находится в союзе с группировкой <@&${args.defensive}>`,
            ephemeral: true
        })
    }

    // если в бд группы из этих 2-х ролей есть и статус уже равен войне, ничего не делать
    if (object.status == 'war') {
        return message.reply({
            content: `Группировка <@&${args.agressor}> уже находится в войне с <@&${args.defensive}>`,
            ephemeral: true
        })
    }

    // если в бд группы из этих 2-х ролей есть, поменять статус на войну
    object.status = 'war'
    object.invater = args.agressor
    object.accepter = args.defensive
    Memory.save()
    return message.reply({
        content: `Группировка <@&${args.agressor}> теперь в войне с группировкой <@&${args.defensive}>`
    })

};

module.exports.names = ["war"]; //У неё есть название
module.exports.interaction = { //И слэш команда
    name: 'war', //И название должно быть такое, как у команды
    description: 'Просто проверочная команда, ничего больше',
    options: [
        {
            name: 'agressor',
            description: 'your role group war',
            type: 8,
            required: true
        },
        {
            name: 'defensive',
            description: 'role group war',
            type: 8,
            required: true
        }
    ],
    defaultPermission: true //Про слэш команды можно узнать из документации
};