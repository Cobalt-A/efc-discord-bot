
module.exports = async (bot,message,args,argsF) => {
    //args - это массив аргументов. Например g/ping 0 1 2 tEsT | args[0]="0", args[1]="1", args[2]="2", args[3]="test" . А так-же argsF[3]=="tEsT"

    const {guild} = message
    const {Memory} = bot
    const memGuild = Memory.guilds.get(guild.id)
    const role = message.guild.roles.cache.find(role => role.id === args.id);
    const member = message.guild.members.cache.get(args.name);
    const isMemberInGroup = member._roles.find((el) => el == args.id)
    const userRolesId = message.member._roles
    const userCommanderRole = memGuild.commanderRoles.find((commanderRole) => userRolesId.find((userRole) => commanderRole.groups.find((group) => userRole == commanderRole.id && group == args.id)))

    // является ли пользователь главой этой группировки
    if (!userCommanderRole) {
        return message.reply({
            content: `Вы не являетесь главой группировки <@&${args.id}>, или такой группировки не существует`,
            ephemeral: true
        })
    }

    // если добовляемый уже с этой ролью
    if (isMemberInGroup) {
        return message.reply({
            content: `<@${args.name}> уже находится в группировке <@&${args.id}>`,
            ephemeral: true
        })
    }

    member.roles.add(role)
    return message.reply({content: `<@${args.name}> теперь <@&${args.id}>`})
    
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