module.exports = async (bot,message,args,argsF) => {
    //args - это массив аргументов. Например g/ping 0 1 2 tEsT | args[0]="0", args[1]="1", args[2]="2", args[3]="test" . А так-же argsF[3]=="tEsT"
    
    const {guild} = message
    const {Memory} = bot
    const memGuild = Memory.guilds.get(guild.id)
    const isGroupRole = memGuild.groupings.find((el) => el == args.grouprole )
    const object = memGuild.commanderRoles.find((obj) => {
        return obj.id == args.role
    })

    if (!message.member.permissions.has("ADMIN")) {
        return message.reply({
            content: 'У вас не достаточно прав для использования этой команды',
            ephemeral: true
        })
    }

    if (!isGroupRole && args.grouprole) {
        return message.reply({
            content: `Роль <@&${args.grouprole}> не является ролью группировки`,
            ephemeral: true
        })
    }

    if (!object) {
        return message.reply({
            content: `Роль <@&${args.role}> не является ролью командующего`,
            ephemeral: true
        })
    }

    if (object && !object.groups.find((el) => el == args.grouprole)) {
        return message.reply({
            content: `Роль <@&${args.role}> не имеет командывания над группировкой <@&${args.grouprole}>`,
            ephemeral: true
        })
    }

    if (object && !args.grouprole) {
        memGuild.commanderRoles = memGuild.commanderRoles.filter((el) =>  el.id !== args.role)
        Memory.save()
        return message.reply({
            content: `Роль <@&${args.role}> не имеет командывания над группировкой <@&${args.grouprole}>`,
            ephemeral: true
        })
    }

    
    object.groups = object.groups.filter((el) => el !== args.grouprole);
    Memory.save()
    return message.reply({
        content: `Теперь роль <@&${args.role}> не является ролью для командования группировкой <@&${args.grouprole}>`
    })
    
};

module.exports.names = ["delcommander"]; //У неё есть название
module.exports.interaction = { //И слэш команда
    name: 'delcommander', //И название должно быть такое, как у команды
    description: 'Просто проверочная команда, ничего больше',
    options: [
        {
            name: 'role',
            description: 'your role group war',
            type: 8,
            required: true
        },
        {
            name: 'grouprole',
            description: 'role group war',
            type: 8,
            required: false
        }
    ],
    defaultPermission: true //Про слэш команды можно узнать из документации
};