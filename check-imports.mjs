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
            
            // CHECAGEM CASE-SENSITIVE RIGOROSA (simula Linux)
            const importDir = dirname(resolvedBase);
            const importFileName = basename(importPath);
            
            if (!existsSync(importDir)) {
              errors.push({
                file: fullPath.replace(dir + '\\', '').replace(/\\/g, '/'),
                line: lineNum + 1,
                importPath,
                notFound: true
              });
              return;
            }
            
            // Lista arquivos reais no diretório
            const actualFiles = readdirSync(importDir);
            const extensions = ['', '.js', '.jsx', '.ts', '.tsx'];
            let foundMatch = null;
            let caseMatch = null;
            
            // Procura arquivo com case exato
            for (const ext of extensions) {
              const testName = importFileName + ext;
              if (actualFiles.includes(testName)) {
                caseMatch = testName;
                break;
              }
            }
            
            // Se não achou com case exato, procura case-insensitive
            if (!caseMatch) {
              const importLower = importFileName.toLowerCase();
              for (const actualFile of actualFiles) {
                const actualLower = actualFile.toLowerCase();
                for (const ext of extensions) {
                  if (actualLower === (importLower + ext).toLowerCase()) {
                    foundMatch = actualFile;
                    break;
                  }
                }
                if (foundMatch) break;
              }
            }
            
            if (!caseMatch && foundMatch) {
              // Arquivo existe mas case está errado (erro no Linux!)
              errors.push({
                file: fullPath.replace(dir + '\\', '').replace(/\\/g, '/'),
                line: lineNum + 1,
                importPath,
                expected: foundMatch.replace(/\.(jsx?|tsx?)$/, ''),
                got: importFileName,
                fullPath: join(importDir, foundMatch).replace(dir + '\\', '').replace(/\\/g, '/')
              });
            } else if (!caseMatch && !foundMatch) {
              // Arquivo não existe
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
