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

    // если такой роли нет
    if (!memGuild.commanderRole.find((el) => el == args.role)) {
        return message.reply({
            content: `Роль <@&${args.role}> не является ролью для командающих`,
            ephemeral: true
        })
    }

    memGuild.commanderRole = memGuild.commanderRole.filter((el) => el !== args.role)
    Memory.save()
    return message.reply({
        content: `Теперь роль <@&${args.role}> не является ролью командающих`
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
        }
    ],
    defaultPermission: true //Про слэш команды можно узнать из документации
};