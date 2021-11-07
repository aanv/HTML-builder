const fs = require('fs')
const path = require('path')

let targetFilePath = path.join(__dirname, 'text.txt')

let stream = fs.createReadStream(targetFilePath)

stream.on('data', (data) => console.log(data.toString()))
