const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const SRC_DIR = path.join(__dirname, '..', 'src');

const results = {
  placeholders: [],
  ariaLabels: [],
  titles: [],
  alts: [],
  rawJsxTexts: [],
  toastsAndAlerts: []
};

function scanFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf-8');
  const relPath = path.relative(path.join(__dirname, '..'), filePath);

  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    });
  } catch (err) {
    console.error(`Error parsing ${relPath}: ${err.message}`);
    return;
  }

  traverse(ast, {
    JSXAttribute(p) {
      const attrName = p.node.name?.name;
      const val = p.node.value;

      // Check placeholder
      if (attrName === 'placeholder' && val && val.type === 'StringLiteral') {
        results.placeholders.push({
          file: relPath,
          line: p.node.loc.start.line,
          value: val.value
        });
      }

      // Check aria-label
      if (attrName === 'aria-label' && val && val.type === 'StringLiteral') {
        results.ariaLabels.push({
          file: relPath,
          line: p.node.loc.start.line,
          value: val.value
        });
      }

      // Check title
      if (attrName === 'title' && val && val.type === 'StringLiteral') {
        results.titles.push({
          file: relPath,
          line: p.node.loc.start.line,
          value: val.value
        });
      }

      // Check alt
      if (attrName === 'alt' && val && val.type === 'StringLiteral') {
        results.alts.push({
          file: relPath,
          line: p.node.loc.start.line,
          value: val.value
        });
      }
    },

    CallExpression(p) {
      const callee = p.node.callee;
      const calleeName = callee.name || callee.property?.name;

      if ((calleeName === 'showToast' || calleeName === 'alert') && p.node.arguments.length > 0) {
        const firstArg = p.node.arguments[0];
        if (firstArg.type === 'StringLiteral') {
          results.toastsAndAlerts.push({
            file: relPath,
            line: p.node.loc.start.line,
            callee: calleeName,
            value: firstArg.value
          });
        }
      }
    }
  });
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walkDir(full);
    } else if (/\.(jsx|js)$/.test(f) && !f.includes('.test.') && !f.includes('i18n') && !f.includes('translations')) {
      scanFile(full);
    }
  }
}

walkDir(SRC_DIR);

console.log('=== I18N CODEBASE SCAN RESULTS ===');
console.log(`Unwrapped 'placeholder' attributes: ${results.placeholders.length}`);
results.placeholders.forEach((item) => console.log(`  [${item.file}:${item.line}] placeholder="${item.value}"`));

console.log(`\nUnwrapped 'aria-label' attributes: ${results.ariaLabels.length}`);
results.ariaLabels.forEach((item) => console.log(`  [${item.file}:${item.line}] aria-label="${item.value}"`));

console.log(`\nUnwrapped 'title' attributes: ${results.titles.length}`);
results.titles.forEach((item) => console.log(`  [${item.file}:${item.line}] title="${item.value}"`));

console.log(`\nUnwrapped 'alt' attributes: ${results.alts.length}`);
results.alts.forEach((item) => console.log(`  [${item.file}:${item.line}] alt="${item.value}"`));

console.log(`\nRaw String toast/alert calls: ${results.toastsAndAlerts.length}`);
results.toastsAndAlerts.forEach((item) => console.log(`  [${item.file}:${item.line}] ${item.callee}("${item.value}")`));
