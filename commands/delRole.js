module.exports = async (bot,message,args,argsF) => {
    //args - это массив аргументов. Например g/ping 0 1 2 tEsT | args[0]="0", args[1]="1", args[2]="2", args[3]="test" . А так-же argsF[3]=="tEsT"


    return message.reply({
        content: `<@${args.name}> теперь не <@&${args.id}>`
    }).then(() => {
        const role = message.guild.roles.cache.find(role => role.id === args.id);
        const user = message.guild.members.cache.get(args.name);
        user.roles.remove(role)
    })

    
    
};
module.exports.names = ["delrole"]; //У неё есть название
module.exports.interaction = { //И слэш команда
    name: 'delrole', //И название должно быть такое, как у команды
    description: 'Просто проверочная команда, ничего больше',
    options: [
        {
            name: 'name',
            description: 'user name',
            type: 6,
            required: true
        },
        {
            name: 'id',
            description: 'role id',
            type: 8,
            required: true
        }
    ],
    defaultPermission: true //Про слэш команды можно узнать из документации
};