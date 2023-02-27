module.exports = async (bot,message,args,argsF) => {
    //args - это массив аргументов. Например g/ping 0 1 2 tEsT | args[0]="0", args[1]="1", args[2]="2", args[3]="test" . А так-же argsF[3]=="tEsT"
    
    const {author, guild} = message
    const {Memory} = bot
    const memGuild = Memory.guilds.get(guild.id)

    const groups = memGuild.wars.map((el) => {
        if (el.groups.find((el) => el == args.group)) {
            const neiborGroup = el.groups.find((el) => el !== args.group)
            return {
                userGroup: args.group, 
                neiborGroup: neiborGroup, 
                accepter: el.accepter,
                invater: el.invater,
                status: el.status,
                pieceInvate: el.pieceInvate,
                unionInvate: el.unionInvate
            }
        }
    }).filter((el) => el)

    if (!groups.length) {
        return message.reply({
            content: `Группировка <@&${args.group}> пока не имеет политических отношей с другими группировками`,
            ephemeral: true
        })
    }

    let contet = ''

    for (const el of groups) {
        const status =  el.status == null ? 'нейтралитете' :
                        el.status == 'war' ? 'войне' :
                        el.status == 'union' ? 'союзе' :
                        'нейтралитете'
        const pieceInvate = el.pieceInvate ? `, ожидается принятие мира группировкой <@&${el.accepter}>` : ''
        const unionInvate = el.unionInvate ? `, ожидается принятие союза группировкой <@&${el.accepter}>` : ''

        const result = `Группировка <@&${el.userGroup}> в ${status} с группировкой <@&${el.neiborGroup}>` + pieceInvate + unionInvate + '\r\n'
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