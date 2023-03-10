module.exports = async (bot,message,args,argsF) => {
    //args - это массив аргументов. Например g/ping 0 1 2 tEsT | args[0]="0", args[1]="1", args[2]="2", args[3]="test" . А так-же argsF[3]=="tEsT"
    
    const {guild} = message
    const {Memory} = bot
    const memGuild = Memory.guilds.get(guild.id)

    if (!message.member.permissions.has("ADMIN")) {
        return message.reply({
            content: 'У вас не достаточно прав для использования этой команды',
            ephemeral: true
        })
    }

    // если такая роль уже есть
    if (memGuild.groupings.find((el) => el.id == args.role)) {
        return message.reply({
            content: `Роль <@&${args.role}> уже является ролью группировки`,
            ephemeral: true
        })
    }

    memGuild.groupings.push({
        id: args.role,
        groups: []
    })

    const groups = memGuild.groupings.map((el) => el.id)

    for (const obj of memGuild.groupings) {
        for (const group of groups) {
            if (obj.groups.find((el) => el.id == group)) continue
            obj.groups.push({
                id: group,
                status: null,
                agressor: null,
                invater: null,
                accepter: null,
                invate: null
            })
        }
    }

    Memory.save()
    return message.reply({
        content: `Теперь роль <@&${args.role}> является ролью группировки`
    })
    
};

module.exports.names = ["addgroup"]; //У неё есть название
module.exports.interaction = { //И слэш команда
    name: 'addgroup', //И название должно быть такое, как у команды
    description: 'Просто проверочная команда, ничего больше',
    options: [
        {
            name: 'role',
            description: 'your role group war',
            type: 8,
            required: true
        }
    ],
    defaultPermission: true //Про слэш команды можно узнать из документации
};