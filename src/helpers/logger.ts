/* eslint-disable no-console */
import chalk from 'chalk';

export class Logger {
    success(content: string) {
        console.log(chalk.green(content));
    }

    error(content: string) {
        console.log(chalk.red(content));
    }

    warn(content: string) {
        console.log(chalk.yellow(content));
    }

    info(content: string) {
        console.log(chalk.white(content));
    }
}

export default new Logger();
