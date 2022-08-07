const net = require('net');
const fs = require('fs');
const readline = require('readline');

const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const port = 3000;
const IP = 'localhost'; //Working on this solo, so IP address is localhost, can be any IP tho.

const client = net.createConnection({ //Connect to Server.
  host: IP,
  port });

client.setEncoding('utf8');

client.on("connect", () => {
  console.log(`Connected to Server! I have a request.`);

  r1.question('Please type the name and the extension of the file you are requesting.\n', (answer) => { //test.txt
    client.write(`${answer}`);

    client.on('data', (data) => {
      if (data !== 'Sorry, file does not exist.') { //Error msg sent by Server when there's an error.
        fs.writeFile(`transfer/${answer}`, data, error => { //Client receives the data and the file test.txt gets saved in ./transfer
          if (error) {
            console.log(`Ooops, something went wrong!`);
            process.exit();
          }
          if (!error) {
            console.log('File processed and saved to \'/transfer\'.');
          }
        });
        console.log(data);
      }
    });
    
    r1.close(); //To end the readline module.

  });

});

client.on('end', () => { //When the Server exits.
  console.log('End of communications. Disconnected from Server.');
});