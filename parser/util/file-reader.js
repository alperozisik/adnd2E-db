import { readFile } from 'node:fs/promises';
import { parse } from 'node-html-parser';
import { relative } from 'path'
import { get } from './globals.js';

const fileReader = async (file) => {
    let content = await readFile(file, { encoding: 'latin1' });
    content = fixFile(file, content);
    let parsedContent = parse(content);
    return { document: parsedContent, text: content };
};

export default fileReader;

const fileFix = {
    "PHB/DD02007.htm": content => {
        let lines = content.split(/\r?\n/g);
        let index = lines.length-3;
        lines[index] = `${lines[index]}</P>`;
        content = lines.join("\n");
        return content;
    }
};

const fixFile = (filePath, content) => {
    let webHelpPath = get("webHelpPath");
    let relativePath = relative(webHelpPath, filePath);
    let reFixTags = /(<\w+.*)\s+(>)/g;
    content = content.replace(reFixTags, "$1$2");
    let fixer = fileFix[relativePath];
    if (!fixer) return content;
    return fixer(content);

}