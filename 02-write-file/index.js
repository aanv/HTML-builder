const fs = require('fs');
const path = require('path');
const process = require('process');
const readline = require('readline');

let targetFilePath = path.join(__dirname, 'newText.txt');
let writableStream = fs.createWriteStream(targetFilePath, 'utf-8');


const rl = readline.createInterface({ 
  input: process.stdin, 
  output: process.stdout 
});

console.log('Enter your text:');

rl.on('line', (input) => {
  if (input === 'exit') {
    rl.close();
  } else {
    writableStream.write(input + '\n');
  }
});

rl.on('close', () => { 
  console.log('\nThank you!'); 
});