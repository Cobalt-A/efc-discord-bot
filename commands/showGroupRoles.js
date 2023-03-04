module.exports = async (bot,message,args,argsF) => {
    //args - это массив аргументов. Например g/ping 0 1 2 tEsT | args[0]="0", args[1]="1", args[2]="2", args[3]="test" . А так-же argsF[3]=="tEsT"
    
    const {guild} = message
    const {Memory} = bot
    const memGuild = Memory.guilds.get(guild.id)
    let commanders = 'Роли командующих: \n'
    let groupings = 'Роли группировок: \n'

    if (!message.member.permissions.has("ADMIN")) {
        return message.reply({
            content: 'У вас не достаточно прав для использования этой команды',
            ephemeral: true
        })
    }

    for (const role of memGuild.commanderRoles) {
        let groups = ''
        for (const group of role.groups) {
            groups = groups + `<@&${group}>` + ', '
        }
        groups = groups.substring(0, groups.length - 2);
        const result = `<@&${role.id}> командует: ${groups} \n`
        commanders = commanders + result
    }

    for (const group of memGuild.groupings) {
        const result = `<@&${group.id}> \n`
        groupings = groupings + result
    }
    

    return message.reply({
        content: commanders + '\n' + groupings
    })
    
};

module.exports.names = ["showgroups"]; //У неё есть название
module.exports.interaction = { //И слэш команда
    name: 'showgroups', //И название должно быть такое, как у команды
    description: 'Просто проверочная команда, ничего больше',
    defaultPermission: true //Про слэш команды можно узнать из документации
};