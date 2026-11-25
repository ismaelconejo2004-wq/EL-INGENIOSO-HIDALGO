// Inserta src/vis.css y src/vis/*.js en index.html, entre marcas.
// El juego sigue siendo un único archivo HTML sin dependencias externas.
'use strict';
const fs = require('fs'), path = require('path');
const raiz = path.join(__dirname, '..');
const f = path.join(raiz, 'index.html');
let html = fs.readFileSync(f, 'utf8');
const css = fs.readFileSync(path.join(raiz, 'src', 'vis.css'), 'utf8').trim();
const dir = path.join(raiz, 'src', 'vis');
const js = fs.readdirSync(dir).filter(n => n.endsWith('.js')).sort().map(n => fs.readFileSync(path.join(dir, n), 'utf8').trim()).join('\n');
if (/<\/script/i.test(js) || /<\/style/i.test(css)) throw new Error('El código incrustado no puede contener </script> ni </style>');
const bloque = `<!--VIS:INI--><style id="vis-css">\n${css}\n</style><script id="vis-js">\n${js}\n</script><!--VIS:FIN-->`;
const re = /<!--VIS:INI-->[\s\S]*?<!--VIS:FIN-->/;
if (re.test(html)) html = html.replace(re, () => bloque);
else html = html.replace(/<\/body>\s*<\/html>\s*$/, () => bloque + '\n</body></html>\n');
fs.writeFileSync(f, html);
console.log('index.html: ' + (Buffer.byteLength(html) / 1024).toFixed(1) + ' KB (bloque visual ' + (Buffer.byteLength(bloque) / 1024).toFixed(1) + ' KB)');
