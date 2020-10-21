/* eslint-disable no-await-in-loop */
import fs from 'fs-extra';
import path from 'path';
import shell from "shelljs";
import Logger from './logger';

export function mkdir(dir: string) {
    try {
        const isExist = fs.existsSync(dir);
        if (isExist) {
            Logger.error(`\n❌ ${path.basename(dir)} directory already existed`);
            Logger.info('process exit with code 1');
            shell.exit(1);
        }
        fs.mkdirSync(dir, 0o755);
    } catch (error) {
        if (error.code !== "EEXIST") {
            throw error;
        }
    }
}

export function copy(src: string, dest: string) {
    return fs.copy(src, dest);
}

export async function copyDir(src: string, dest: string) {
    mkdir(dest);
    const files = await fs.readdir(src);
    for (let i = 0; i < files.length; i++) {
        const current = fs.lstatSync(path.join(src, files[i]));
        if (current.isDirectory()) {
            await copyDir(path.join(src, files[i]), path.join(dest, files[i]));
        } else if (current.isSymbolicLink()) {
            const symlink = fs.readlinkSync(path.join(src, files[i]));
            fs.symlinkSync(symlink, path.join(dest, files[i]));
        } else {
            await copy(path.join(src, files[i]), path.join(dest, files[i]));
        }
    }
}
