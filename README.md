### Paso 1: Inicializar el proyecto
Abre la terminal en la carpeta donde tienes tus 3 archivos (`index.html`, `styles.css`, `script.js`) y ejecuta:

```bash
npm init -y
```
*(Esto crea un archivo `package.json` básico).*

### Paso 2: Instalar las herramientas necesarias
Ejecuta este comando en la terminal para descargar las librerías que harán el trabajo sucio (Minificador de HTML/CSS y Ofuscador de JS):

```bash
npm install html-minifier-terser javascript-obfuscator
```

### Paso 3: Crear el script de construcción
Crea un nuevo archivo llamado **`build.js`** en la misma carpeta y pega este código.

Este script hace la magia:
1.  Lee tus archivos.
2.  **Ofusca** el código Javascript (haciéndolo ilegible para humanos pero funcional para la máquina).
3.  **Incrusta** el CSS y el JS dentro del HTML.
4.  **Minifica** todo el HTML resultante (quita espacios, comentarios, saltos de línea).

**Archivo:** `build.js`
```javascript
const fs = require('fs');
const { minify } = require('html-minifier-terser');
const JavaScriptObfuscator = require('javascript-obfuscator');

async function build() {
    console.log('🚀 Iniciando proceso de construcción...');

    try {
        // 1. Leer los archivos originales
        let html = fs.readFileSync('index.html', 'utf8');
        let css = fs.readFileSync('styles.css', 'utf8');
        let js = fs.readFileSync('script.js', 'utf8');

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
            minifyJS: false // Ya lo ofuscamos arriba
        });

        // 5. Guardar el archivo final
        fs.writeFileSync('index_final.html', htmlFinal);

        console.log('✅ ¡ÉXITO! Archivo creado: index_final.html');
        console.log('📂 Puedes abrir index_final.html en tu navegador.');

    } catch (error) {
        console.error('❌ Error durante la construcción:', error);
    }
}

build();
```

### Paso 4: Ejecutar
En tu terminal, corre:

```bash
node build.js
```

### Resultado
Aparecerá un nuevo archivo llamado **`index_final.html`** en tu carpeta.

*   Es un **único archivo**.
*   Pesa mucho menos.
*   Si intentas leer el código fuente, el Javascript será ininteligible (ofuscado), protegiendo tu lógica.
*   Funciona exactamente igual que tu versión de desarrollo.