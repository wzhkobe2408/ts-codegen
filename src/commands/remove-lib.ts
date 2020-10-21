import { Command } from '@oclif/command';
import inquirer from 'inquirer';
import rmdir from 'rmdir';

export default class RemoveLib extends Command {
    static description = 'remove typescript library'

    static examples = [
        `$ ts-codegen remove-lib`,
    ]

    static questions: Parameters<typeof inquirer.prompt>[0] = [
        {
            type: 'input',
            name: 'pkgName',
            message: `package name:`,
        },
        {
            type: 'input',
            name: 'scope',
            message: `scope:`,
            default: 'packages',
        },
    ];

    async run() {
        const basicConfig = await inquirer.prompt(RemoveLib.questions) as Record<string, any>;
        const destPath = `${process.cwd()}/${basicConfig.scope}/${basicConfig.pkgName}`;

        try {
            rmdir(destPath);
        } catch (error) {
            rmdir(destPath);
        }
    }
}
