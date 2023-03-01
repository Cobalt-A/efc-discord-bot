module.exports = async (bot,message,args,argsF) => {
    //args - это массив аргументов. Например g/ping 0 1 2 tEsT | args[0]="0", args[1]="1", args[2]="2", args[3]="test" . А так-же argsF[3]=="tEsT"

    const {guild} = message
    const {Memory} = bot
    const memGuild = Memory.guilds.get(guild.id)
    const member = message.guild.members.cache.get(args.name);
    const role = message.guild.roles.cache.find(role => role.id === args.id);
    const userRolesId = message.member._roles
    const memberRolesId = member._roles
    const commanderRole = memGuild.commanderRole.find((el) => userRolesId.find((element) => element == el ))
    const groupRole = memGuild.groupings.find((el) => userRolesId.find((element) => element == el ))
    const isMemberInGroup = memberRolesId.find((el) => el == args.id)
    const isOwnerMessage = member.user == message.user
    
    // является ли пользователь главой этой группировки
    if (!commanderRole || groupRole !== args.id) {
        return message.reply({
            content: `Вы не являетесь главой группировки <@&${args.id}>, или такой группировки не существует`,
            ephemeral: true
        })
    }

    // если добовляемый уже с этой ролью
    if (!isMemberInGroup) {
        return message.reply({
            content: `<@${args.name}> не находится в группировке <@&${args.id}>`,
            ephemeral: true
        })
    }

    // если добовляемый уже с этой ролью
    if (isOwnerMessage) {
        return message.reply({
            content: `Вы не можете удалить из группировки <@&${args.id}> самого себя`,
            ephemeral: true
        })
    }

    member.roles.remove(role)
    return message.reply({content: `<@${args.name}> теперь не <@&${args.id}>`})
    
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