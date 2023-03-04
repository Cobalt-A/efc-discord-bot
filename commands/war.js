module.exports = async (bot,message,args,argsF) => {
    //args - это массив аргументов. Например g/ping 0 1 2 tEsT | args[0]="0", args[1]="1", args[2]="2", args[3]="test" . А так-же argsF[3]=="tEsT"
    
    const {guild} = message
    const {Memory} = bot
    const memGuild = Memory.guilds.get(guild.id)
    const userRolesId = message.member._roles
    const userCommanderRole = memGuild.commanderRoles.find((commanderRole) => userRolesId.find((userRole) => commanderRole.groups.find((group) => userRole == commanderRole.id && group == args.agressor)))
    const userCommandGroup = userCommanderRole ? userCommanderRole.groups.find((el) => el == args.agressor) : undefined

    // если есть обьект с этими ролями записать его
    const userObject = memGuild.groupings.find((el) => el.id == args.agressor)
    const userObjectGroup = userObject ? userObject.groups.find((el) => el.id == args.defensive) : undefined

    const object = memGuild.groupings.find((el) => el.id == args.defensive)
    const objectGroup = object ? object.groups.find((el) => el.id == args.agressor) : undefined

    // является ли пользователь главой этой группировки
    if (!userCommandGroup || !userObject) {
        return message.reply({
            content: `Вы не являетесь главой группировки <@&${args.agressor}>, или такой группировки не существует`,
            ephemeral: true
        })
    }

    // нет ли дубликата
    if (args.agressor == args.defensive) {
        return message.reply({
            content: `Нельзя обьявить войну своей группировке`,
            ephemeral: true
        })
    }

    // является ли эта роль, ролью группировки
    if (!object) {
        return message.reply({
            content: `Роль <@&${args.defensive}> не является ролью группировки`,
            ephemeral: true
        })
    }

    // если есть союз
    if (userObjectGroup.status == 'union' && objectGroup.status == 'union') {
        return message.reply({
            content: `Война не возможна, группировка <@&${args.agressor}> находится в союзе с группировкой <@&${args.defensive}>`,
            ephemeral: true
        })
    }

    // если в бд группы из этих 2-х ролей есть и статус уже равен войне, ничего не делать
    if (userObjectGroup.status == 'war' && objectGroup.status == 'war') {
        return message.reply({
            content: `Группировка <@&${args.agressor}> уже находится в войне с <@&${args.defensive}>`,
            ephemeral: true
        })
    }

    // если в бд группы из этих 2-х ролей есть, поменять статус на войну
    userObjectGroup.status = 'war'
    userObjectGroup.agressor = args.agressor
    objectGroup.status = 'war'
    objectGroup.agressor = args.agressor
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