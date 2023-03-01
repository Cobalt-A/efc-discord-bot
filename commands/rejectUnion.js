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
        return obj.groups.find((el) => el == args.accepter) && obj.groups.find((el) => el == args.invater)
    })

    // является ли пользователь главой этой группировки
    if (!commanderRole || groupRole !== args.accepter) {
        return message.reply({
            content: `Вы не являетесь главой группировки <@&${args.accepter}>, или такой группировки не существует`,
            ephemeral: true
        })
    }

    // является ли эта роль, ролью группировки
    if (!memGuild.groupings.find((el) => el == args.invater)) {
        return message.reply({
            content: `Роль <@&${args.invater}> не является ролью группировки`,
            ephemeral: true
        })
    }

    // если в бд обьекта с этими 2-я ролями нет, они запишутся в бд
    if (!object) {
        memGuild.wars.push({
            groups: [args.invater, args.accepter],
            agressor: null,
            defensive: null,
            invater: null,
            accepter: null,
            status: null,
            pieceInvate: null,
            unionInvate: null
        })
        Memory.save()
        return message.reply({
            content: `Группировка <@&${args.invater}> не предлогала союз группировке <@&${args.accepter}>`,
            ephemeral: true
        })
    }

    // если уже есть союз
    if (object.status == 'union') {
        object.status = null
        Memory.save()
        return message.reply({
            content: `Группировка <@&${args.accepter}> расторгает союз с группировкой <@&${args.invater}>`
        })
    }

    // если нету запроса
    if (object.unionInvate !== 'inProgress') {
        return message.reply({
            content: `Группировка <@&${args.invater}> не предлогала союз группировке <@&${args.accepter}>`,
            ephemeral: true
        })
    }

    // если группировка принимающая равняется той которая предлогает
    if (args.accepter == object.invater) {
        object.unionInvate = null
        Memory.save()
        return message.reply({
            content: `Группировка <@&${object.invater}> отменяет свое предложение о союзе с группировкой <@&${object.accepter}>`
        })
    }

    object.unionInvate = null
    Memory.save()
    return message.reply({
        content: `Группировка <@&${args.accepter}> не принимает союз группировки <@&${args.invater}>`
    })
    
    
};

module.exports.names = ["rejectunion"]; //У неё есть название
module.exports.interaction = { //И слэш команда
    name: 'rejectunion', //И название должно быть такое, как у команды
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