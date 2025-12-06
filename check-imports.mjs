import { fileURLToPath } from 'url';
import { dirname, join, resolve, basename, extname } from 'path';
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function checkCaseSensitive(dir) {
  const errors = [];
  
  function scan(currentDir) {
    const files = readdirSync(currentDir);
    
    for (const file of files) {
      const fullPath = join(currentDir, file);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
          scan(fullPath);
        }
      } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.tsx') || file.endsWith('.ts')) {
        const content = readFileSync(fullPath, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, lineNum) => {
          const importMatch = line.match(/import\s+.*from\s+['"](\.\.?\/[^'"]+)['"]/);
          if (importMatch) {
            const importPath = importMatch[1];
            const fileDir = dirname(fullPath);
            let resolvedBase = resolve(fileDir, importPath);
            
            // Tenta extensões possíveis
            const extensions = ['', '.js', '.jsx', '.ts', '.tsx'];
            let foundPath = null;
            
            for (const ext of extensions) {
              const testPath = resolvedBase + ext;
              if (existsSync(testPath)) {
                foundPath = testPath;
                break;
              }
            }
            
            if (foundPath) {
              const actualFileName = basename(foundPath);
              const importFileName = basename(importPath);
              const actualFileNameNoExt = actualFileName.replace(/\.(jsx?|tsx?)$/, '');
              const importFileNameNoExt = importFileName.replace(/\.(jsx?|tsx?)$/, '');
              
              // CHECAGEM CASE-SENSITIVE (igual Linux/Netlify)
              if (actualFileNameNoExt !== importFileNameNoExt) {
                errors.push({
                  file: fullPath.replace(dir + '\\', '').replace(/\\/g, '/'),
                  line: lineNum + 1,
                  importPath,
                  expected: actualFileNameNoExt,
                  got: importFileNameNoExt,
                  fullPath: foundPath.replace(dir + '\\', '').replace(/\\/g, '/')
                });
              }
            } else {
              errors.push({
                file: fullPath.replace(dir + '\\', '').replace(/\\/g, '/'),
                line: lineNum + 1,
                importPath,
                notFound: true
              });
            }
          }
        });
      }
    }
  }
  
  scan(dir);
  return errors;
}

console.log('🔍 Simulando checagem case-sensitive do Netlify (Linux)...\n');

const errors = checkCaseSensitive(join(__dirname, 'src'));

if (errors.length === 0) {
  console.log('✅ Sem problemas de case!\n');
  process.exit(0);
} else {
  console.log('❌ error during build:\n');
  
  errors.forEach(err => {
    if (err.notFound) {
      console.log(`❌ Could not resolve "${err.importPath}" from "${err.file}"`);
      console.log(`   file: /opt/build/repo/${err.file}`);
    } else {
      console.log(`❌ Could not resolve "${err.importPath}" from "${err.file}"`);
      console.log(`   file: /opt/build/repo/${err.file}:${err.line}`);
      console.log(`   CASE MISMATCH: importando "${err.got}" mas arquivo é "${err.expected}"`);
      console.log(`   arquivo real: ${err.fullPath}`);
    }
    console.log('');
  });
  
  console.log(`\n"build.command" failed\n`);
  process.exit(1);
}
