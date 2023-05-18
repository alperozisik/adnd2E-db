import * as path from 'path'
import fileReader from './util/file-reader.js';
import detectParser from './detect-parser.js';
import allParsers from './all-parsers.js';
const readFiles = new WeakMap();
const defaultTimeOut = 1000;

class File {
    constructor(filePath) {
        this.filePath = filePath;

    }
    async readFile () { //cached
        let content = null;
        if(readFiles.has(this)) {
            content = readFiles.get(this);
        } else {
            content = await fileReader(this.filePath);
            readFiles.set(this, content);
            setTimeout(()=> {readFiles.delete(this)}, defaultTimeOut);
        }
        return content;
    }
    async assignParser() {
        this.parser = detectParser(this.filePath, (await this.readFile()));
        return this.parser;
    }

    async parse(){
        !this.parser && this.assignParser();
        return allParsers[this.parser] && allParsers[this.parser].parse(this.filePath, await this.readFile());
    };

}

export default File;