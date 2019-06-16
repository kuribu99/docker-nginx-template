const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

console.info(`
Loading configurations...
`);
const config = require('./config.json');
const srcFolder = config.src || 'src';
const destFolder = config.dest || 'nginx/sites-enabled';
const templatesFolder = config.templates || 'templates';
console.info(`
Configurations loaded:
-- source folder        : "${srcFolder}"
-- destination folder   : "${destFolder}"
-- templates folder     : "${templatesFolder}"
`);


console.info(`
Loading templates...
`)
const allTemplates = fs.readdirSync(path.join(__dirname, templatesFolder)).reduce((all, templateName) => {
    console.info(`-- ${templateName}`);
    const body = fs.readFileSync(path.join(__dirname, templatesFolder, templateName)).toString();
    all[templateName] = handlebars.compile(body);
    return all;
}, {});
console.info(`
Loading templates... Done
`)


console.info(`
Cleaning output directory...
`)
fs.readdirSync(path.join(__dirname, destFolder)).forEach(file => {
    fs.unlinkSync(path.join(__dirname, destFolder, file));
})
console.info(`
Cleaning output directory... Done
`)


console.info(`
Loading hosts...
`)
const hosts = require(path.join(__dirname, srcFolder, 'hosts.json'));
hosts.forEach(host => {
    const template = host.template;
    const serverName = host.serverName;
    const backendUrl = host.backendUrl;
    if (!serverName) {
        throw `[${serverName}] Missing "serverName"`;
    }
    if (!backendUrl) {
        throw `[${serverName}] Missing "backendUrl"`;
    }
    if (!template) {
        throw `[${serverName}] Missing "template"`;
    }
    if (!allTemplates[template]) {
        throw `[${serverName}] Invalid template: "${template}"`;
    }

    const templateFn = allTemplates[template];
    const data = host.data || {};

    const result = templateFn({
        serverName,
        backendUrl,
        ...data
    });
    fs.writeFileSync(path.join(__dirname, destFolder, serverName), result);
    console.info(`[${serverName}] Compiled successfully with template "${template}"`);

});
console.info(`
Loading hosts... Done
`)