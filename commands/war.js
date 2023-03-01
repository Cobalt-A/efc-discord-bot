module.exports = async (bot,message,args,argsF) => {
    //args - это массив аргументов. Например g/ping 0 1 2 tEsT | args[0]="0", args[1]="1", args[2]="2", args[3]="test" . А так-же argsF[3]=="tEsT"
    
    const {guild} = message
    const {Memory} = bot
    const memGuild = Memory.guilds.get(guild.id)
    const userRolesId = message.member._roles
    const commanderRole = memGuild.commanderRole.find((el) => userRolesId.find((element) => element == el ))
    const groupRole = memGuild.groupings.find((el) => userRolesId.find((element) => element == el ))

    // если есть обьект с этими ролями записать его
    const object = memGuild.wars.find((obj) => {
        return obj.groups.find((el) => el == args.agressor) && obj.groups.find((el) => el == args.defensive)
    })

    // является ли пользователь главой этой группировки
    if (!commanderRole || groupRole !== args.agressor) {
        return message.reply({
            content: `Вы не являетесь главой группировки <@&${args.agressor}>, или такой группировки не существует`,
            ephemeral: true
        })
    }

    // является ли эта роль, ролью группировки
    if (!memGuild.groupings.find((el) => el == args.defensive)) {
        return message.reply({
            content: `Роль <@&${args.defensive}> не является ролью группировки`,
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
    object.agressor = args.agressor
    object.defensive = args.defensive
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