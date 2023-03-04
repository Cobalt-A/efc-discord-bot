module.exports = async (bot,message,args,argsF) => {
    //args - это массив аргументов. Например g/ping 0 1 2 tEsT | args[0]="0", args[1]="1", args[2]="2", args[3]="test" . А так-же argsF[3]=="tEsT"
    
    const {author, guild} = message
    const {Memory} = bot
    const memGuild = Memory.guilds.get(guild.id)
    const userObject = memGuild.groupings.find((el) => el.id == args.group)
    let contet = ''

    if (!userObject) {
        return message.reply({
            content: `Роль <@&${args.group}> не является ролью группировки`,
            ephemeral: true
        })
    }

    for (const group of userObject.groups) {
        const status =  group.status == null ? 'нейтралитете' :
                        group.status == 'war' ? 'войне' :
                        group.status == 'union' ? 'союзе' :
                        'нейтралитете'
        const invate =  group.invate == 'piece' ? `, ожидается принятие мира группировкой <@&${group.accepter}>` :
                        group.invate == 'union' ? `, ожидается принятие союза группировкой <@&${group.accepter}>` :
                        ''

        const result = `Группировка <@&${args.group}> в ${status} с группировкой <@&${group.id}>` + invate + ';\r\n'
        contet = contet + result
    }

    return message.reply({
        content: contet,
        ephemeral: true
    })
    
};

module.exports.names = ["groupstatus"]; //У неё есть название
module.exports.interaction = { //И слэш команда
    name: 'groupstatus', //И название должно быть такое, как у команды
    description: 'Просто проверочная команда, ничего больше',
    options: [
        {
            name: 'group',
            description: 'your role group war',
            type: 8,
            required: true
        }
    ],
    defaultPermission: true //Про слэш команды можно узнать из документации
};