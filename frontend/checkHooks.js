const fs = require('fs');
const path = require('path');

function checkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      checkDir(full);
    } else if (f.endsWith('.jsx') || f.endsWith('.js')) {
      const content = fs.readFileSync(full, 'utf8');
      const hooks = ['useEffect', 'useState', 'useMemo', 'useCallback', 'useRef', 'useContext'];
      for (const h of hooks) {
        // regex match identifier h not preceded by .
        const regex = new RegExp('(?<![.\\w])' + h + '(?![\\w])', 'g');
        if (regex.test(content)) {
          const importLine = content.match(/import\s+(?:React\s*,\s*)?\{([^}]+)\}\s+from\s+['"]react['"]/);
          if (importLine) {
            const imported = importLine[1].split(',').map(s => s.trim());
            if (!imported.includes(h)) {
              console.log(`MISSING HOOK in ${full}: ${h}`);
            }
          } else if (!content.includes(`React.${h}`)) {
            console.log(`NO HOOK IMPORT in ${full}: ${h}`);
          }
        }
      }
    }
  }
}

checkDir(path.resolve(__dirname, 'src'));
