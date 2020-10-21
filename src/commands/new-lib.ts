import { Command } from '@oclif/command';
import inquirer from 'inquirer';
import CliSteps from 'cli-step';
import rmdir from 'rmdir';
import Logger from '../helpers/logger';
import { copyDir } from './../helpers/copy';
import { renderLib } from '../helpers/render-template';
import {getAuthorInfo, getGitRepoUrl} from "../helpers/git";
import { LIB_PATH } from '../constant';
import { normalizeDependency } from '../helpers/dependency';
import { delay } from '../utils';

export default class NewLib extends Command {
    static description = 'create new typescript library'

    static examples = [
        `$ ts-codegen new-lib`,
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

    private steps = [
        {
            taskName: 'Loading template...',
            icon: 'mag',
            run: () => { /**/ },
        },
        {
            taskName: 'Rendering template...',
            icon: 'package',
            run: () => { /**/ },
        },
        {
            taskName: 'Normalize dependencies...',
            icon: 'pencil',
            run: () => { /**/ },
        },
    ];

    async executeSteps(cliSteps: any) {
        let curStep = null;
        cliSteps.startRecording();

        for (let i = 0; i < this.steps.length; i++) {
            const step = this.steps[i];
            curStep = cliSteps.advance(step.taskName, step.icon).start();
            // eslint-disable-next-line no-await-in-loop
            await step.run();
            curStep.stop();
        }

        const nanoSecs = cliSteps.stopRecording();
        curStep = null;

        Logger.success('Successfully created library 🎉');
        Logger.info(`  ✨  Done in ${Math.round(nanoSecs / (1e9))}s.`);
    }

    async run() {
        let basicConfig = await inquirer.prompt(NewLib.questions) as Record<string, any>;
        const destPath = `${process.cwd()}/${basicConfig.scope}/${basicConfig.pkgName}`;
        const authorInfo = getAuthorInfo();
        const repoUrl = getGitRepoUrl();
        basicConfig = {
            repoUrl,
            ...authorInfo,
            ...basicConfig,
        }

        try {
            const cliSteps = new CliSteps(this.steps.length);
            this.steps[0].run = () => copyDir(LIB_PATH, destPath);
            this.steps[1].run = () => renderLib(destPath, basicConfig);
            this.steps[2].run = async () => {
                await delay(100);
                await normalizeDependency(destPath);
            }
            await this.executeSteps(cliSteps);
        } catch (error) {
            rmdir(destPath);
        }
    }
}
