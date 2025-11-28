const { exec } = require('child_process');

console.log('Testando execucao de comandos...');

exec('java -version', (error, stdout, stderr) => {
    console.log('--- JAVA ---');
    if (error) console.log('Erro:', error.message);
    console.log('Stdout:', stdout);
    console.log('Stderr:', stderr);
});

exec('adb --version', (error, stdout, stderr) => {
    console.log('--- ADB ---');
    if (error) console.log('Erro:', error.message);
    console.log('Stdout:', stdout);
    console.log('Stderr:', stderr);
});

const bubblewrapCmd = process.platform === 'win32' ? 'bubblewrap.cmd' : 'bubblewrap';
exec(`${bubblewrapCmd} --version`, (error, stdout, stderr) => {
    console.log('--- BUBBLEWRAP ---');
    if (error) console.log('Erro:', error.message);
    console.log('Stdout:', stdout);
    console.log('Stderr:', stderr);
});
