module.exports = async (bot,message,args,argsF) => {
    //args - это массив аргументов. Например g/ping 0 1 2 tEsT | args[0]="0", args[1]="1", args[2]="2", args[3]="test" . А так-же argsF[3]=="tEsT"

    if (message.member.permissions.has("MANAGE_MESSAGES")) {
        return message.reply({
            content: 'У вас не достаточно прав для использования этой команды',
            ephemeral: true
        })
    }

    message.deferReply();
    message.deleteReply();
    return message.channel.send(`${args.reply}`)
    
};

module.exports.names = ["reply"]; //У неё есть название
module.exports.interaction = { //И слэш команда
    name: 'reply', //И название должно быть такое, как у команды
    description: 'Просто проверочная команда, ничего больше',
    options: [
        {
            name: 'reply',
            description: 'user reply',
            type: 3,
            required: true
        }
    ],
    defaultPermission: true //Про слэш команды можно узнать из документации
};