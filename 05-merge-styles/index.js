const fsPromises = require('fs/promises');
const path = require('path');

let outputFilePath = path.join(__dirname, 'project-dist', 'bundle.css');
let initialFolderPath = path.join(__dirname, 'styles');

fsPromises.rm(outputFilePath, { recursive: true, force: true })
.then( () => {
  return fsPromises.readdir(initialFolderPath, { withFileTypes: true });
})
.then( data => {
  data.forEach(file => {
    let filePath = path.join(initialFolderPath, file.name);
    if(file.isFile() && path.extname(filePath) === '.css'){
      console.log(file.name);
      fsPromises.readFile(filePath, {encoding: 'utf-8'})
        .then(data => {
          data += '\n\n';
          fsPromises.appendFile(outputFilePath, data);
        });
    }
  })
})
.catch(console.error);

