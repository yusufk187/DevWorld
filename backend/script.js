// Loop through Array of Objects
var objPeople = [
	{ // Object @ 0 index
		username: "turtlecode",
		password: "codechannel"
	},
	{ // Object @ 1 index
		username: "monkeycode",
		password: "codechannel"
	}
]

function getInfo() {
	var username = document.getElementById('username').value
	var password = document.getElementById('password').value

	for(var i = 0; i < objPeople.length; i++) {
		// check is user input matches username and password of a current index of the objPeople array
		if(username == objPeople[i].username && password == objPeople[i].password) {
			console.log(username + " is logged in!!!")
			// stop the function if this is found to be true
            window.location.href = 'http://www.google.com';
			return
            
		}
	}
	console.log("incorrect username or password")
}