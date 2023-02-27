module.exports = async (bot,message,args,argsF) => {
    //args - это массив аргументов. Например g/ping 0 1 2 tEsT | args[0]="0", args[1]="1", args[2]="2", args[3]="test" . А так-же argsF[3]=="tEsT"
    
    const {author, guild} = message
    const {Memory} = bot
    const memGuild = Memory.guilds.get(guild.id)
    const invaterRole = message.guild.roles.cache.find(role => role.id === args.invater);
    const rolesId = message.member._roles
    const roles = rolesId.map((el) => {
        const result = message.guild.roles.cache.find(role => role.id === el)
        return result.name
    })
    const isComander = roles.find((el) => !el.indexOf('Глава') ? 1 : 0 );
    const inGroup = roles.find((el) => !el.indexOf(invaterRole.name) ? 1 : 0 );

    // если есть обьект с этими ролями записать его
    const object = memGuild.wars.filter((obj) => {
        return obj.groups.find((el) => el == args.invater) && obj.groups.find((el) => el == args.accepter)
    })[0]

    // если пользователь не глава этой группировки
    if (!isComander || !inGroup) {
        return message.reply({
            content: `Вы не являетесь главой группировки <@&${args.invater}>`,
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
            unionInvate: 'inProgress'
        })
        Memory.save()
        return message.reply({
            content: `Группировка <@&${args.invater}> предлогает союз группировке <@&${args.accepter}>`
        })
    }

    // если война
    if (object.status == 'war') {
        return message.reply({
            content: `Союз не возможен группировка <@&${args.invater}> находится в войне с <@&${args.accepter}>`,
            ephemeral: true
        })
    }

    // если уже есть союз
    if (object.status == 'union') {
        return message.reply({
            content: `Группировка <@&${args.invater}> уже находится в союзе <@&${args.accepter}>`,
            ephemeral: true
        })
    }

    // если уже есть запрос
    if (object.unionInvate == 'inProgress') {
        return message.reply({
            content: `Группировка <@&${object.invater}> уже предложила союз группировке <@&${object.accepter}>`,
            ephemeral: true
        })
    }

    object.unionInvate = 'inProgress'
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