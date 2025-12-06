const fs = require('fs');
const path = require('path');

function validateImports(dir) {
  const errors = [];
  
  function scanDirectory(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    files.forEach(file => {
      const fullPath = path.join(currentDir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
        scanDirectory(fullPath);
      } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const importRegex = /import\s+(?:{[^}]*}|[^'"]*)\s+from\s+['"]([^'"]+)['"]/g;
        
        let match;
        while ((match = importRegex.exec(content)) !== null) {
          const importPath = match[1];
          
          // Skip node_modules imports
          if (!importPath.startsWith('.')) continue;
          
          const resolvedPath = path.resolve(path.dirname(fullPath), importPath);
          
          // Try different extensions
          const possiblePaths = [
            resolvedPath,
            resolvedPath + '.js',
            resolvedPath + '.jsx',
            resolvedPath + '.ts',
            resolvedPath + '.tsx',
            path.join(resolvedPath, 'index.js'),
            path.join(resolvedPath, 'index.jsx')
          ];
          
          let found = false;
          let actualFile = null;
          
          for (const testPath of possiblePaths) {
            if (fs.existsSync(testPath)) {
              found = true;
              actualFile = testPath;
              break;
            }
          }
          
          if (!found) {
            errors.push({
              file: fullPath.replace(dir, ''),
              import: importPath,
              line: content.substring(0, match.index).split('\n').length
            });
          } else {
            // Check case sensitivity (Linux/Netlify issue)
            const actualFileName = path.basename(actualFile);
            const expectedFileName = path.basename(resolvedPath);
            
            if (actualFileName !== expectedFileName && actualFileName !== expectedFileName + '.jsx' && actualFileName !== expectedFileName + '.js') {
              const dirPath = path.dirname(actualFile);
              const filesInDir = fs.readdirSync(dirPath);
              const matchingFile = filesInDir.find(f => f.toLowerCase() === actualFileName.toLowerCase() && f !== actualFileName);
              
              if (matchingFile) {
                errors.push({
                  file: fullPath.replace(dir, ''),
                  import: importPath,
                  line: content.substring(0, match.index).split('\n').length,
                  issue: 'CASE_MISMATCH',
                  expected: matchingFile,
                  found: actualFileName
                });
              }
            }
          }
        }
      }
    });
  }
  
  scanDirectory(dir);
  return errors;
}

console.log('🔍 Validando imports (simulando ambiente Netlify - case-sensitive)...\n');

const projectRoot = path.join(__dirname);
const errors = validateImports(projectRoot);

if (errors.length === 0) {
  console.log('✅ Nenhum erro de import encontrado!\n');
} else {
  console.log('❌ ERROS ENCONTRADOS:\n');
  errors.forEach((err, index) => {
    console.log(`${index + 1}. Erro em: ${err.file}:${err.line}`);
    console.log(`   Import: "${err.import}"`);
    if (err.issue === 'CASE_MISMATCH') {
      console.log(`   ⚠️  CASE MISMATCH (Linux/Netlify vai falhar!):`);
      console.log(`   Esperado: ${err.expected}`);
      console.log(`   Encontrado: ${err.found}`);
    } else {
      console.log(`   ❌ Arquivo não existe!`);
    }
    console.log('');
  });
  console.log(`Total de erros: ${errors.length}\n`);
  process.exit(1);
}
