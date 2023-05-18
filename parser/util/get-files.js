import { readdir, stat } from 'node:fs/promises';
import { join } from 'path'

const extension = /\.htm$/;

const getFiles = async (sourcePath) => {
    let fileList = [];
    let files = await readdir(sourcePath);
    for (let file of files) {
        file = join(sourcePath, file);
        let fileStat = await stat(file);
        if (fileStat.isDirectory()) {
            let newFiles = await getFiles(file);
            fileList = fileList.concat(newFiles);
        } else {
            if (extension.test(file))
                fileList.push(file);
        }
    }
    return fileList;
};

export default getFiles;