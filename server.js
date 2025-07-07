const http = require("http");
const querystring = require("querystring");
const { Client, Events, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers], 
  partials: [
    Partials.Channel,
    Partials.MessageContent] });

http
  .createServer(function (req, res) {
    if (req.method == "POST") {
      var data = "";
      req.on("data", function (chunk) {
        data += chunk;
      });
      req.on("end", function () {
        if (!data) {
          console.log("No post data");
          res.end();
          return;
        }
        var dataObject = querystring.parse(data);
        console.log("post:" + dataObject.type);
        if (dataObject.type == "wake") {
          console.log("Woke up in post");
          res.end();
          return;
        }
        if (dataObject.type == "userCheck"){
          console.log("ponnpoko:" + dataObject.type);
          let userId = dataObject.userID;
          var whoIsHere = peopleInTheGuild(userId);
          var words = whoIsHere;
          res.end("うにょん" + words);
          return;
        }
        if (dataObject.type == "userCheck2"){
          console.log("ponnpoko:" + dataObject.type);
          let userId = dataObject.userID;
          var whoIsHere = peopleInTheGuild2(userId);
          var words = whoIsHere;
          res.end("うにょん" + words);
          return;
        }
        res.end();
      });
    } else if (req.method == "GET") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Discord Bot is active now\n");
    }
  })
  .listen(3000);

client.once(Events.ClientReady, c => {
  console.log("Bot準備完了～");
  client.user.setPresence({ activities: [{ name: 'ボックス管理' }] });
});


if (process.env.LEAVES == undefined) {
  console.log("LEAVESが設定されていません。");
  process.exit(0);
}

client.login(process.env.LEAVES);


function peopleInTheGuild(userId){
  try {
    let guild = client.guilds.cache.get("1167389033396174909");
    let user = client.users.cache.find(user => user.id == String(userId));
    if (!user){return "ありません";}else{
      let memId = guild.members.cache.get(userId);
      if (!memId){return "ありません";}else{console.log(`成功！${memId}`); let userName = String(user.username); return "あります" + String(userName)}
    }
  }catch(e){
    console.log("失敗！", e)
    return "通信エラー" + String(e);
  }
}

function peopleInTheGuild2(userName){
  try {
    let guild = client.guilds.cache.get("1167389033396174909");
    let user = client.users.cache.find(user => user.username == String(userName));
    if (!user){return "ありません";}
    else{
      let userId = String(user.id);
      let memId = guild.members.cache.get(userId);
      if (!memId){return "ありません";}else{console.log(`成功！${memId}`); return "あります" + String(userId)}
    }
  }catch(e){
    console.log("失敗！", e)
    return "通信エラー" + String(e);
  }
}
