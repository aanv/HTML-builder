const fs = require('fs');
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
  let html = await getFileContent(templatePath);
  // console.log(htmlFileContent);

  html = await replaceTemplate(html);
  // console.log(html);
  await fsPromises.writeFile(newHtmlPath, html);
}

async function createFolder(folderPath) {
  return fsPromises.mkdir(folderPath, {recursive: true})
}

async function getFileContent(path) {
  return await fsPromises.readFile(path, 'utf-8');
}

async function replaceTemplate(file) {

  let fromIndex = 0;
  let tagsInTemplate = [];

  for(let n = 0; fromIndex >=0; n++){
    let openBracketsIndex = file.indexOf('{{', fromIndex);
    fromIndex = openBracketsIndex;
    if (fromIndex >=0){
      let closeBracketsIndex = file.indexOf('}}', fromIndex);
      fromIndex = closeBracketsIndex;
      tagsInTemplate[n] = file.substring(openBracketsIndex + 2, closeBracketsIndex);
    }
  }

  for(tag of tagsInTemplate) {
    let htmlToReplace = await getFileContent(componentsFolderPath + `/${tag}.html`, 'utf-8');
    file = await file.replace(`{{${tag}}}`, `${htmlToReplace}`);
  }

  return await file;
}

pageBuilder();







