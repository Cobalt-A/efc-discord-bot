
module.exports = async (bot,message,args,argsF) => {
    //args - это массив аргументов. Например g/ping 0 1 2 tEsT | args[0]="0", args[1]="1", args[2]="2", args[3]="test" . А так-же argsF[3]=="tEsT"

    const role = message.guild.roles.cache.find(role => role.id === args.id);
    const member = message.guild.members.cache.get(args.name);
    const rolesId = message.member._roles

    const roles = rolesId.map((el) => {
        const result = message.guild.roles.cache.find(role => role.id === el)
        return result.name
    })

    const isComander = roles.find((el) => !el.indexOf('Глава') ? 1 : 0 );
    const inGroup = roles.find((el) => !el.indexOf(role.name) ? 1 : 0 );
    const isMemberInGroup = rolesId.find((el) => el == args.id)

    if (!isMemberInGroup) {
        return message.reply({
            content: `<@${args.name}> уже находится в группировке <@&${args.id}>`,
            ephemeral: true
        })
    }

    if (!isComander || !inGroup) {
        return message.reply({
            content: `Вы не являетесь главой группировки <@&${args.id}>`,
            ephemeral: true
        })
    }

    return message.reply({content: `<@${args.name}> теперь <@&${args.id}>`}).then(() => {member.roles.add(role)})
    
};

module.exports.names = ["addrole"]; //У неё есть название
module.exports.interaction = { //И слэш команда
    name: 'addrole', //И название должно быть такое, как у команды
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