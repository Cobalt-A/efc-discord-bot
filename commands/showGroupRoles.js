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

    let comanders = ''
    let groups = ''

    for (const el of memGuild.commanderRole) {
        comanders = comanders + ` <@&${el}>`
    }

    for (const el of memGuild.groupings) {
        groups = groups + ` <@&${el}>`
    }

    if (!comanders) comanders = ' здесь пока еще нет ролей'
    if (!groups) groups = ' здесь пока еще нет ролей'

    return message.reply({
        content: `Роли командующих:${comanders}` + '\r\n' + `Роли группировок:${groups}`
    })
    
};

module.exports.names = ["showgroups"]; //У неё есть название
module.exports.interaction = { //И слэш команда
    name: 'showgroups', //И название должно быть такое, как у команды
    description: 'Просто проверочная команда, ничего больше',
    defaultPermission: true //Про слэш команды можно узнать из документации
};