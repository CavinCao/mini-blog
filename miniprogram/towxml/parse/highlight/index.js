const config = require('../../config'),
    hljs = require('./highlight');

const languages = {
    'c-like': require('./languages/c-like'),
    'c': require('./languages/c'),
    'bash': require('./languages/bash'),
    'css': require('./languages/css'),
    'dart': require('./languages/dart'),
    'go': require('./languages/go'),
    'java': require('./languages/java'),
    'javascript': require('./languages/javascript'),
    'json': require('./languages/json'),
    'less': require('./languages/less'),
    'scss': require('./languages/scss'),
    'shell': require('./languages/shell'),
    'xml': require('./languages/xml'),
    'htmlbars': require('./languages/htmlbars'),
    'nginx': require('./languages/nginx'),
    'php': require('./languages/php'),
    'python': require('./languages/python'),
    'python-repl': require('./languages/python-repl'),
    'typescript': require('./languages/typescript')
};

config.highlight.forEach(item => {
    if (languages[item]) {
        hljs.registerLanguage(item, languages[item]);
    }
});

module.exports = hljs;