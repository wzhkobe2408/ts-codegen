/* eslint-disable no-await-in-loop */
import path from 'path';
import fs from 'fs-extra';
import Handlebars from 'handlebars';

const renderLists = [
    'package.json',
    'README.md',
];

export async function renderTemplate(path: string, data: Record<string, any>) {
    if (renderLists.some(renderPath => path.includes(renderPath))) {
        const content = await fs.readFile(path, { encoding: 'utf-8' });
        const template = Handlebars.compile(content);

        return fs.writeFile(path, template(data), { encoding: 'utf-8' });
    }
}

async function getFileInfo(path: string) {
    try {
        const stat = await fs.lstat(path);
        return {
            isDir: stat.isDirectory(),
            isFile: stat.isFile(),
        };
    } catch (error) {
        return null;
    }
}

export async function renderLib(dir: string, ctx: Record<string, any>) {
    const fileInfo = await getFileInfo(dir);

    if (fileInfo?.isDir) {
        const files = await fs.readdir(dir);

        for (let i = 0; i < files.length; i++) {
            const childPath = path.join(dir, files[i]);
            const current = await fs.lstat(childPath);
            if (current.isDirectory()) {
                await renderLib(childPath, ctx);
            } else {
                await renderTemplate(childPath, ctx);
            }
        }
    } else if (fileInfo?.isFile) {
        return renderTemplate(dir, ctx);
    }
}
