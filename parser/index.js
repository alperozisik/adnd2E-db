import * as path from 'path'
import getFiles from './util/get-files.js'
import { fileURLToPath } from 'url';
//import fileReader from './util/file-reader.js';
import File from './file.js';
import {set} from './util/globals.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webHelpRelativePath = "../WebHelp";
const webHelpPath = path.join(__dirname, webHelpRelativePath);
set("webHelpPath", "webHelpPath");

const fileList = await getFiles(webHelpPath);
//const parsedFiles = await Promise.all(fileList.map(file => fileReader(file)));
const data = {};

await Promise.all(fileList.map(async (filePath) => {
    let file = new File(filePath);
    let key = await file.assignParser();
    if (!key)
        return;
    let dataKeyObject = data[key] || (data[key] = []);
    dataKeyObject.push(await file.parse());

    return dataKeyObject;
}));


debugger;
