const tmi = require('tmi.js');
var opn = require('opn');
const readline = require('readline');
var key="";
let cont = [];
var winner = "";
var monate = -1;

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})
const client = new tmi.Client({
	connection: {
		secure: true,
		reconnect: true
	},
	channels: ["papaplatte" ]
});


const main = async () => {
	await question1()
	await question2()
	console.log("Get Winner?");
}
const question1 = () => {
	return new Promise((resolve, reject) => {
		rl.question(`key?  `, (answer) => {
			key = answer;
			resolve()
		})
	})
}
const question2 = () => {
	return new Promise((resolve, reject) => {
		rl.question(`Monate?  `, (answer) => {
			monate = answer;
			resolve()
		})
	})
}


client.connect();
main();

rl.on('line', (input) => {
	if (cont.length > 0) {
		getWinner();
	}
})

client.on('message', (channel, tags, message, self) => {
	message = message.trim();
	var user = "#"+`${tags['display-name']}`.toLowerCase();


	if (winner == `${tags['display-name']}`) {
		console.log(`${tags['display-name']}: ${message}`);
    }

	var sub = tags['badge-info'];
	if (sub != null) {
		if (message.toLowerCase() == key.toLowerCase() && key != "" && monate != -1 && Object.values(sub) >= monate) {
			for (i = 0; i < cont.length; i++) {
				if (cont[i] == `${tags['display-name']}`) {
					return;
				}
			}

			cont.push(`${tags['display-name']}`);
		}
	}

});

function getWinner() {
	let number =  Math.floor(Math.random() * cont.length);
	winner = cont[number];
	opn('https://www.twitch.tv/popout/papaplatte/viewercard/' + winner);
	console.log("Winner :" + winner);
	console.log("");
}
