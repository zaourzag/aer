const req = require('@aero/centra')
const Discord = require("discord.js")
async
if (command === "joke"){
let getjoke - async () => {let response = await req('https://official-joke-api.appspot.com/random_joke').send().then(res => res.json) ;

let joke = response.data 
return joke

}{
let jokevalue = await getjoke();
msg.reply(`here's your joke \n $jokevalue.setup \n \n $jokevalue.punchline`);

}
