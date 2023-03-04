module.exports = async (bot,message,args,argsF) => {
    //args - это массив аргументов. Например g/ping 0 1 2 tEsT | args[0]="0", args[1]="1", args[2]="2", args[3]="test" . А так-же argsF[3]=="tEsT"
    
    const {guild} = message
    const {Memory} = bot
    const memGuild = Memory.guilds.get(guild.id)
    const userRolesId = message.member._roles
    const userCommanderRole = memGuild.commanderRoles.find((commanderRole) => userRolesId.find((userRole) => commanderRole.groups.find((group) => userRole == commanderRole.id && group == args.accepter)))
    const userCommandGroup = userCommanderRole ? userCommanderRole.groups.find((el) => el == args.accepter) : undefined

    // если есть обьект с этими ролями записать его
    const userObject = memGuild.groupings.find((el) => el.id == args.accepter)
    const userObjectGroup = userObject ? userObject.groups.find((el) => el.id == args.invater) : undefined

    const object = memGuild.groupings.find((el) => el.id == args.invater)
    const objectGroup = object ? object.groups.find((el) => el.id == args.accepter) : undefined

    // является ли пользователь главой этой группировки
    if (!userCommandGroup || !userObject) {
        return message.reply({
            content: `Вы не являетесь главой группировки <@&${args.accepter}>, или такой группировки не существует`,
            ephemeral: true
        })
    }

    // является ли эта роль, ролью группировки
    if (!object) {
        return message.reply({
            content: `Роль <@&${args.invater}> не является ролью группировки`,
            ephemeral: true
        })
    }

    // если нету запроса на принятие мира
    if (userObjectGroup.invate !== 'piece' && objectGroup.invate !== 'piece') {
        return message.reply({
            content: `Группировка <@&${args.invater}> не предлогала перемирие группировке <@&${args.accepter}>`,
            ephemeral: true
        })
    }

    // если группировка принимающая равняется той которая предлогает
    if (userObjectGroup.invater == args.accepter) {
        userObjectGroup.invate = null
        objectGroup.invate = null
        Memory.save()
        return message.reply({
            content: `Группировка <@&${userObjectGroup.invater}> отменяет свое предложение о мире с группировкой <@&${userObjectGroup.accepter}>`
        })
    }

    userObjectGroup.invate = null
    objectGroup.invate = null
    Memory.save()
    return message.reply({
        content: `Группировка <@&${args.accepter}> отменяет предложение о мире с группировкой <@&${args.invater}>`
    })
    
    
};

module.exports.names = ["rejectpiece"]; //У неё есть название
module.exports.interaction = { //И слэш команда
    name: 'rejectpiece', //И название должно быть такое, как у команды
    description: 'Просто проверочная команда, ничего больше',
    options: [
        {
            name: 'accepter',
            description: 'your role group war',
            type: 8,
            required: true
        },
        {
            name: 'invater',
            description: 'role group war',
            type: 8,
            required: true
        }
    ],
    defaultPermission: true //Про слэш команды можно узнать из документации
};