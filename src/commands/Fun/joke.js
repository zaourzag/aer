const axios = require("axios")
const Discord = require("discord.js")
async
if (command === "joke"){
let getjoke - async () => {let response = await axios.get("https://official-joke-api.appspot.com/random_joke");

let joke = response.data 
return joke

}
let jokevalue = await getjoke();
msg.reply(`here's your joke \n $jokevalue.setup \n \n $jokevalue.punchline`)

}
