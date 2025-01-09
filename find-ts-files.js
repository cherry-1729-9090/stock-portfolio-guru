import { readdir, stat } from 'fs/promises';
import { join, resolve, relative } from 'path';
import { fileURLToPath } from 'url';

async function findTypeScriptFiles(dir) {
    let results = [];

    async function walkDir(currentPath) {
        const files = await readdir(currentPath);
        
        for (const file of files) {
            const filePath = join(currentPath, file);
            const stats = await stat(filePath);
            
            if (stats.isDirectory() && !file.includes('node_modules')) {
                await walkDir(filePath);
            } else if (file.match(/\.(ts|tsx)$/)) {
                results.push(filePath);
            }
        }
    }

    await walkDir(dir);
    return results;
}

// Get the directory name in ES modules
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const projectRoot = resolve(__dirname, '..');

try {
    const tsFiles = await findTypeScriptFiles(projectRoot);
    console.log(`Found ${tsFiles.length} TypeScript files:`);
    tsFiles.forEach(file => {
        console.log(`- ${relative(projectRoot, file)}`);
    });
} catch (error) {
    console.error('Error:', error);
} 