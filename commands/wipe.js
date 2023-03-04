module.exports = async (bot,message,args,argsF) => {
    //args - это массив аргументов. Например g/ping 0 1 2 tEsT | args[0]="0", args[1]="1", args[2]="2", args[3]="test" . А так-же argsF[3]=="tEsT"

    const {guild} = message
    const {Memory} = bot
    const memGuild = Memory.guilds.get(guild.id)
    const groups = memGuild.groupings.map((el) => el.id)

    if (!message.member.permissions.has("ADMIN")) {
        return message.reply({
            content: 'У вас не достаточно прав для использования этой команды',
            ephemeral: true
        })
    }

    for (const obj of memGuild.groupings) {
        obj.groups = []
        for (const group of groups) {
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
        content: 'Вайп и инициализация группировок успешно проведены'
    })
    
};

module.exports.names = ["wipe"]; //У неё есть название
module.exports.interaction = { //И слэш команда
    name: 'wipe', //И название должно быть такое, как у команды
    description: 'Просто проверочная команда, ничего больше',
    defaultPermission: true //Про слэш команды можно узнать из документации
};