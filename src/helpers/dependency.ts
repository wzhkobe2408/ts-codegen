import fs from 'fs-extra';
import get from 'lodash.get';
import { safeJsonParse, safeJsonStringify } from './json';

export async function getDependencyVersion(dependency: string): Promise<string> {
    const pkgPath = `${process.cwd()}/node_modules/${dependency}/package.json`;
    try {
        const pkg = safeJsonParse(await fs.readFile(pkgPath, { encoding: 'utf-8' }));
        return get(pkg, 'version') || '*';
    } catch (error) {
        return '*';
    }
}

export async function normalizeDependency(destPath: string) {
    const tempPkgPath = `${destPath}/__package.json`;
    const pkgPath = `${destPath}/package.json`;

    await fs.rename(tempPkgPath, pkgPath);
    const pkg = safeJsonParse(await fs.readFile(pkgPath, { encoding: 'utf-8' }));
    const devDependencies = get(pkg, 'devDependencies', {}) as Record<string, string>;

    await Promise.all(Object.keys(devDependencies).map(async key => {
        let version = await getDependencyVersion(key);
        version = version === '*' ? '*' : `^${version}`;

        devDependencies[key] = version;
        return undefined;
    }));

    pkg.devDependencies = devDependencies;

    await fs.writeFile(pkgPath, safeJsonStringify(pkg), { encoding: 'utf-8' });
}
