const fsPromises = require('fs/promises');
const path = require('path');

let folderPath = path.join(__dirname, 'secret-folder');

const files = fsPromises.readdir(folderPath, {withFileTypes: true});

files.then( data => {
  for (const file of data) {
    if(!file.isDirectory()){
      let filePath = path.join(folderPath, file.name);
      let fileName = path.parse(filePath).name;
      let fileExt = path.extname(filePath).split('.')[1];

      let fileStat = fsPromises.stat(filePath);
      fileStat.then(stat => { 
        console.log(`${fileName} -  ${fileExt} - ${stat.size} bytes`);
      });
    }
  }
})
.catch(console.error);
