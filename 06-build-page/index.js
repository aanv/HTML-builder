const fsPromises = require('fs/promises');
const path = require('path');

// folders
let componentsFolderPath = path.join(__dirname, 'components');
let assetsFolderPath = path.join(__dirname, 'assets');
let stylesFolderPath = path.join(__dirname, 'styles');

let distFolderPath = path.join(__dirname, 'project-dist');
let newAssetsFolderPath = path.join(distFolderPath, 'assets');

// files
let templatePath = path.join(__dirname, 'template.html');

let newHtmlPath = path.join(distFolderPath, 'index.html');
let newCssPath = path.join(distFolderPath, 'style.css');


async function pageBuilder() {
  await createFolder(distFolderPath);
  let html = await fsPromises.readFile(templatePath, 'utf-8');
  html = await replaceTagsTo(html);

  await fsPromises.writeFile(newHtmlPath, html);
  await mergeStyles();
  await copyFolder(assetsFolderPath, newAssetsFolderPath);
}

async function createFolder(folderPath) {
  return fsPromises.mkdir(folderPath, {recursive: true})
}

async function replaceTagsTo(file) {

  let fromIndex = 0;
  let tagsInTemplate = [];

  for(let n = 0; fromIndex >=0; n++) {
    let openBracketsIndex = file.indexOf('{{', fromIndex);
    fromIndex = openBracketsIndex;
    if (fromIndex >=0){
      let closeBracketsIndex = file.indexOf('}}', fromIndex);
      fromIndex = closeBracketsIndex;
      tagsInTemplate[n] = file.substring(openBracketsIndex + 2, closeBracketsIndex);
    }
  }

  for(tag of tagsInTemplate) {
    let htmlToReplace = await fsPromises.readFile(componentsFolderPath + `/${tag}.html`, 'utf-8');
    file = await file.replace(`{{${tag}}}`, `${htmlToReplace}`);
  }

  return await file;
}

async function mergeStyles() {
  let stylesArray = [];

  await fsPromises.rm(newCssPath, { recursive: true, force: true });
  let styleFiles = await fsPromises.readdir(stylesFolderPath, { withFileTypes: true });
  
  
  for(file of styleFiles) {
    let filePath = path.join(stylesFolderPath, file.name);
    if(file.isFile() && path.extname(filePath) === '.css'){
      let styleToPush = await fsPromises.readFile(filePath, 'utf-8');
      styleToPush += '\n\n';
      stylesArray.push(styleToPush);
    }
  }

  await fsPromises.writeFile(newCssPath, stylesArray);
}

async function copyFolder(fromFolderPath, toFolderPath) {
  await fsPromises.rm(toFolderPath, { recursive: true, force: true });
  await createFolder(toFolderPath);
  let filesToCopy = await fsPromises.readdir(fromFolderPath, { withFileTypes: true });
  for(file of filesToCopy){
    let sourceFilePath = path.join(fromFolderPath, file.name);
    let newFilePath = path.join(toFolderPath, file.name);
    
    if(file.isDirectory()) {
      await createFolder(newFilePath);
      await copyFolder(sourceFilePath, newFilePath);
    } else {
      await fsPromises.copyFile(sourceFilePath, newFilePath);
    }
  }
}

pageBuilder();
