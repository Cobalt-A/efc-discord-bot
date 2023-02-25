module.exports = async (bot,message,args,argsF) => {
    //args - это массив аргументов. Например g/ping 0 1 2 tEsT | args[0]="0", args[1]="1", args[2]="2", args[3]="test" . А так-же argsF[3]=="tEsT"
    
    const {author, guild} = message
    const {Memory} = bot
    const memGuild = Memory.guilds.get(guild.id)
    

    for (const key in memGuild.wars) {
        if (memGuild.wars[key].groups.find((el) => el == args.agressor) && memGuild.wars[key].groups.find((el) => el == args.defendor)) {
            console.log(memGuild.wars[key]);
            memGuild.wars[key].war = true
            message.reply({
                content: `Группировка <@&${args.agressor}> теперь в войне с группировкой <@&${args.defendor}>`
            })
            console.log(memGuild.wars);
            Memory.save()
            return
        }
    }
    

    memGuild.wars.push({groups: [args.agressor, args.defendor], war: true})
    console.log(memGuild.wars);
    Memory.save()
    return message.reply({
        content: `Группировка <@&${args.agressor}> теперь в войне с группировкой <@&${args.defendor}>`
    })
    
};

module.exports.names = ["war"]; //У неё есть название
module.exports.interaction = { //И слэш команда
    name: 'war', //И название должно быть такое, как у команды
    description: 'Просто проверочная команда, ничего больше',
    options: [
        {
            name: 'agressor',
            description: 'your role group war',
            type: 8,
            required: true
        },
        {
            name: 'defendor',
            description: 'role group war',
            type: 8,
            required: true
        }
    ],
    defaultPermission: true //Про слэш команды можно узнать из документации
};