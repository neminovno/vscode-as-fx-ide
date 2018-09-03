import * as fs from 'fs';
import * as path from 'path';
import { log } from '../logger';
import { IProjectFile } from './types';

export function getDirFiles(fsPath: string): string[] {
    return fs.readdirSync(fsPath);
}

export function isDirEmpty(fsPath: string): boolean {
    return fs.readdirSync(fsPath).length === 0;
}

export function deleteFiles(fsPath: string) {
    try {
        var files = fs.readdirSync(fsPath);
    }
    catch (e) {
        console.error('deleteFiles err:' + e);
        return;
    }

    if (files.length > 0) {
        for (var i = 0; i < files.length; i++) {
            var filePath = path.join(fsPath, files[i]);
            if (fs.statSync(filePath).isFile()) {
                fs.unlinkSync(filePath);
            }
            else {
                deleteFiles(filePath);
                fs.rmdirSync(filePath);
            }
        }
    }
}

export function copyDir(srcDir: string, destDir: string) {

    var results: string[] = [];
    var list = fs.readdirSync(srcDir);
    var src, dst;
    var sep = path.sep;

    list.forEach(function (file) {
        src = srcDir + sep + file;
        dst = destDir + sep + file;
        //console.log(src);
        var stat = fs.statSync(src);
        if (stat && stat.isDirectory()) {
            try {
                log('creating dir: ' + dst);
                fs.mkdirSync(dst);
                results.push(dst);
            } catch (e) {
                log('copyFiles: mkdir error: ' + dst + ' e:' + e);
            }
            results = results.concat(copyDir(src, dst));
        } else {
            try {
                log('copying file: ' + dst);
                //fs.createReadStream(src).pipe(fs.createWriteStream(dst));
                fs.writeFileSync(dst, fs.readFileSync(src));
                
                //produces:
                //uld't copy file: c:\dev\vsc-extensions\test4\.vscode\launch.json e:TypeError: fs.copyFileSync is not a function
                //fs.copyFileSync(src, dst);
            } catch (e) {
                log('copyFiles writeFile error: ' + dst + ' e:' + e);
            }
            results.push(dst);
        }
    });

    return results;
}

export async function writeFiles(targetDir: string, fd: IProjectFile[]) {
    return new Promise(function (resolve, reject) {
        let cnt = 0;

        for (let file of fd) {
            const fsPath: string = path.join(targetDir, file.fileName);

            try {
                fs.writeFileSync(fsPath, file.fileData);
                log('writeFiles: written file: ' + fsPath + ' file lenght: ' + file.fileData.length);
                if (++cnt === fd.length) {
                    resolve();
                }
            } catch (err) {
                log('writeFiles: error: ' + err);
                reject(err);
            }
        }
    });
}

export async function mkDirsInDir(targetDir: string, newDirs: string[]) {
    newDirs.reduce((parentDir, childDir) => {
        const curDir = path.resolve(targetDir, parentDir, childDir);
        log('mkDirsInDir: creating dir: ' + curDir);

        try {
            if (fs.existsSync(curDir)) {
                log('mkDirsInDir: skip, dir exists: ' + curDir);
            }
            else {
                fs.mkdirSync(curDir);
                log('mkDirsInDir: created! dir: ' + curDir);
            }
        } catch (err) {
            log('mkDirsInDir err: ' + err);
            throw err;
        }

        return curDir;
    }, targetDir);
}