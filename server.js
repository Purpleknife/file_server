const net = require("net");
const fs = require('fs');

const port = 3000;
const server = net.createServer();

server.on("connection", (client) => {
  console.log('New client connected! Hi!');

  client.setEncoding("utf8"); //Interpret data as text
  
  client.write('File request processing.');

  client.on('data', data => {
    console.log('File requested by client:', data); //data here is the name of the file typed by the Client: test.txt

    fs.readFile(`./${data}`, 'utf8', (error, data) => { //Check if the file exists and sends back its content.
      if (error) {
        client.write('Sorry, file does not exist.'); //Error msg sent to Client.
        process.exit();
      }
      if (!error) {
        client.write(data); //If file/ data is found, send back the data to Client.
        process.exit();
      }
    });
  });

  client.on('end', () => {
    console.log('Client closed connection.'); //If the Client exits mid request.
  });

  client.on('error', error => {
    console.log(`Error: ${error}`);
  });
});

server.on('error', (error) => {
  throw error;
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});


/*
Remarks:
-Wanted to check if the file exists with fs.access() first,
but in Nodejs.org, they recommended to use fs.readFile() directly.
-In the end, our objective is to check if the file exists AND send back its data.
So fs.readFile() seemed more suitable for this (?)
*/