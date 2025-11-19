const fs = require('fs');
const { minify } = require('html-minifier-terser');
const JavaScriptObfuscator = require('javascript-obfuscator');

async function build() {
    console.log('🚀 Iniciando proceso de construcción...');

    try {
        // 1. Leer los archivos originales
        let html = fs.readFileSync('src/index.html', 'utf8');
        let css = fs.readFileSync('src/styles.css', 'utf8');
        let js = fs.readFileSync('src/script.js', 'utf8');

        console.log('📦 Archivos leídos.');

        // 2. Ofuscar el Javascript
        // NOTA: 'renameProperties: false' es CRÍTICO para que Vue.js siga funcionando.
        // Si se renombra 'nombre' a 'a', el HTML {{ nombre }} dejará de andar.
        const obfuscationResult = JavaScriptObfuscator.obfuscate(js, {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 0.75,
            numbersToExpressions: true,
            simplify: true,
            stringArray: true,
            stringArrayEncoding: ['base64'],
            stringArrayThreshold: 0.75,
            renameProperties: false, // ¡IMPORTANTE PARA VUE!
            renameGlobals: false
        });

        const jsObfuscated = obfuscationResult.getObfuscatedCode();
        console.log('🔒 Javascript ofuscado.');

        // 3. Inyectar CSS y JS en el HTML
        // Reemplazamos el link del CSS por el estilo inline
        html = html.replace('<link rel="stylesheet" href="styles.css">', `<style>${css}</style>`);

        // Reemplazamos el script src por el script inline ofuscado
        html = html.replace('<script src="script.js"></script>', `<script>${jsObfuscated}</script>`);

        console.log('💉 Código inyectado en HTML.');

        // 4. Minificar el HTML resultante (incluyendo el CSS interno)
        const htmlFinal = await minify(html, {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true,
            minifyCSS: true,
            minifyJS: true // Ya lo ofuscamos arriba
        });

        // 5. Guardar el archivo final
        fs.writeFileSync('index.html', htmlFinal);

        console.log('✅ ¡ÉXITO! Archivo creado: index_final.html');
        console.log('📂 Puedes abrir index_final.html en tu navegador.');

    } catch (error) {
        console.error('❌ Error durante la construcción:', error);
    }
}

build();