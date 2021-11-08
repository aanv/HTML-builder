const fsPromises = require('fs/promises');
const path = require('path');

let folderPath = path.join(__dirname, 'files');
let copyFolderPath = path.join(__dirname, 'files-copy');

fsPromises.mkdir(copyFolderPath, {recursive: true})
  .catch(console.error);

fsPromises.readdir(copyFolderPath).then(
  data => {
    for (const file of data) {
      let delFilePath = path.join(copyFolderPath, file);
      fsPromises.unlink(delFilePath);
    }
    console.log(`... ${path.basename(copyFolderPath)} has been emptied.`);
    return fsPromises.readdir(folderPath);
  }
).then(data => {
  for (const file of data) {
    let src = path.join(folderPath, file);
    let dest = path.join(copyFolderPath, file);
    fsPromises.copyFile(src, dest).then(() => {
      console.log(`${file} copied to ${path.basename(copyFolderPath)}`);
    });
    }
})
.catch(console.error);