module.exports = async (bot,message,args,argsF) => {
    //args - это массив аргументов. Например g/ping 0 1 2 tEsT | args[0]="0", args[1]="1", args[2]="2", args[3]="test" . А так-же argsF[3]=="tEsT"
    
    const {author, guild} = message
    const {Memory} = bot
    const memGuild = Memory.guilds.get(guild.id)
    const accepterRole = message.guild.roles.cache.find(role => role.id === args.accepter);
    const rolesId = message.member._roles
    const roles = rolesId.map((el) => {
        const result = message.guild.roles.cache.find(role => role.id === el)
        return result.name
    })
    const isComander = roles.find((el) => !el.indexOf('Глава') ? 1 : 0 );
    const inGroup = roles.find((el) => !el.indexOf(accepterRole.name) ? 1 : 0 );

    // если есть обьект с этими ролями записать его
    const object = memGuild.wars.filter((obj) => {
        return obj.groups.find((el) => el == args.invater) && obj.groups.find((el) => el == args.accepter)
    })[0]

    // если пользователь не глава этой группировки
    if (!isComander || !inGroup) {
        return message.reply({
            content: `Вы не являетесь главой группировки <@&${args.accepter}>`,
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
            content: `Группировка <@&${args.invater}> не предлогала перемирие группировке <@&${args.accepter}>`,
            ephemeral: true
        })
    }

    // если нету запроса на принятие мира
    if (object.pieceInvate !== 'inProgress') {
        return message.reply({
            content: `Группировка <@&${args.invater}> не предлогала перемирие группировке <@&${args.accepter}>`,
            ephemeral: true
        })
    }


    // если группировка принимающая равняется той которая предлогает
    if (args.accepter == object.invater) {
        object.pieceInvate = null
        Memory.save()
        return message.reply({
            content: `Группировка <@&${object.invater}> отменяет свое предложение о мире с группировкой <@&${object.accepter}>`
        })
    }

    object.pieceInvate = null
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