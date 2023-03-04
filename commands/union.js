module.exports = async (bot,message,args,argsF) => {
    //args - это массив аргументов. Например g/ping 0 1 2 tEsT | args[0]="0", args[1]="1", args[2]="2", args[3]="test" . А так-же argsF[3]=="tEsT"
    
    const {guild} = message
    const {Memory} = bot
    const memGuild = Memory.guilds.get(guild.id)
    const userRolesId = message.member._roles
    const userCommanderRole = memGuild.commanderRoles.find((commanderRole) => userRolesId.find((userRole) => commanderRole.groups.find((group) => userRole == commanderRole.id && group == args.invater)))
    const userCommandGroup = userCommanderRole ? userCommanderRole.groups.find((el) => el == args.invater) : undefined

    // если есть обьект с этими ролями записать его
    const userObject = memGuild.groupings.find((el) => el.id == args.invater)
    const userObjectGroup = userObject ? userObject.groups.find((el) => el.id == args.accepter) : undefined

    const object = memGuild.groupings.find((el) => el.id == args.accepter)
    const objectGroup = object ? object.groups.find((el) => el.id == args.invater) : undefined

    // является ли пользователь главой этой группировки
    if (!userCommandGroup || !userObject) {
        return message.reply({
            content: `Вы не являетесь главой группировки <@&${args.invater}>, или такой группировки не существует`,
            ephemeral: true
        })
    }

    if (args.invater == args.accepter) {
        return message.reply({
            content: `Нельзя предложить союз своей группировке`,
            ephemeral: true
        })
    }

    // является ли эта роль, ролью группировки
    if (!object) {
        return message.reply({
            content: `Роль <@&${args.accepter}> не является ролью группировки`,
            ephemeral: true
        })
    }

    // если война
    if (userObjectGroup.status == 'war' && objectGroup.status == 'war') {
        return message.reply({
            content: `Союз не возможен группировка <@&${args.invater}> находится в войне с <@&${args.accepter}>`,
            ephemeral: true
        })
    }

    // если уже есть союз
    if (userObjectGroup.status == 'union' && objectGroup.status == 'union') {
        return message.reply({
            content: `Группировка <@&${args.invater}> уже находится в союзе <@&${args.accepter}>`,
            ephemeral: true
        })
    }

    // если уже есть запрос
    if (userObjectGroup.invate == 'union' && objectGroup.invate == 'union') {
        return message.reply({
            content: `Группировка <@&${userObjectGroup.invater}> уже предложила союз группировке <@&${userObjectGroup.accepter}>`,
            ephemeral: true
        })
    }

    userObjectGroup.invate = 'union'
    userObjectGroup.invater = args.invater
    userObjectGroup.accepter = args.accepter
    objectGroup.invate = 'union'
    objectGroup.invater = args.invater
    objectGroup.accepter = args.accepter
    Memory.save()
    return message.reply({
        content: `Группировка <@&${args.invater}> предлогает союз группировке <@&${args.accepter}>`
    })
    
};

module.exports.names = ["union"]; //У неё есть название
module.exports.interaction = { //И слэш команда
    name: 'union', //И название должно быть такое, как у команды
    description: 'Просто проверочная команда, ничего больше',
    options: [
        {
            name: 'invater',
            description: 'your role group war',
            type: 8,
            required: true
        },
        {
            name: 'accepter',
            description: 'role group war',
            type: 8,
            required: true
        }
    ],
    defaultPermission: true //Про слэш команды можно узнать из документации
};