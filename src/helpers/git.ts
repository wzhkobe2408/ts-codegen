import shell, {ShellString} from 'shelljs';

function checkGit() {
    if (!shell.which('git')) {
        shell.echo('Sorry, this script requires git');
        shell.exit(1);
    }
}

export function getAuthorInfo() {
    checkGit();
    const shellRes: ShellString = shell.exec('git config --list', {
        silent: true,
    });
    const userInfo = {
        name: '',
        email: '',
    };
    if (shellRes.code === 0) {
        shellRes.stdout.split('\n')
            .forEach(line => {
                const [key, value] = line.split('=');

                if (key === 'user.name') {
                    userInfo.name = value;
                }
                if (key === 'user.email') {
                    userInfo.email = value;
                }
            });
    }

    return userInfo;
}

export function getGitRepoUrl() {
    let repoUrl = '';
    const shellRes = shell.exec('git config --get remote.origin.url', {
        silent: true,
    });

    if (shellRes.code === 0) {
        repoUrl = shellRes.stdout.replace('\n', '');
    }

    return repoUrl;
}
