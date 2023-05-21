/*********************************************************
 *   Utility file to download monster HTML files 
 *   This will generate 
 */

import * as path from 'path';
import { parse as htmlParse } from 'node-html-parser';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const indexURL = "https://web.archive.org/web/20180818101532/http://lomion.de/cmm/_contents.php";
const __dirname = path.dirname(__filename);
const saveDir = path.join(__dirname, "../..", "sourceData/Monsters");

async function downloadFile(url, fileName) {
    const response = await fetch(url);
    const body = await response.text();
    const document = htmlParse(body);
    const list = document.querySelectorAll("p > nobr > a");
    let callList = [];
    for (let a of list) {
        let href = a.getAttribute("href");
        let fileName = href.replace(".php", ".html");
        let savePath = path.join(saveDir, fileName);
        let statURL = `https://web.archive.org/web/20180818101532/http://lomion.de/cmm/${href}`;
        let p = fetch(statURL).then(response => response.text())
            .then(text => writeFile(savePath, text, "utf8"))
            .then(()=> console.info(`file written: ${fileName}`));
        callList.push(p);
    }
    return Promise.all(callList);
  }

downloadFile(indexURL)
  .then(()=> console.log("all files written successfully"))
  .catch(err => console.error(err));