module.exports = async (bot,message,args,argsF) => {
    //args - это массив аргументов. Например g/ping 0 1 2 tEsT | args[0]="0", args[1]="1", args[2]="2", args[3]="test" . А так-же argsF[3]=="tEsT"

    const role = message.guild.roles.cache.find(role => role.id === args.id);
    const member = message.guild.members.cache.get(args.name);
    const rolesId = message.member._roles

    for (const idRole of rolesId) {
        const userRole = message.guild.roles.cache.find(role => role.id === idRole);
        const arrayRoleNames = userRole.name.split(' ')
        
        if (arrayRoleNames[0] == 'Глава') {
            if (arrayRoleNames[1][0] == role.name[0]) {
                return message.reply({content: `<@${args.name}> теперь не <@&${args.id}>`}).then(() => {member.roles.remove(role)})
            }
        }
    }

    return message.reply({
        content: `Вы не являетесь главой группировки <@&${args.id}>`,
        ephemeral: true
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