import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

/**
 * Checks architecture patterns using AST parsing
 */
export async function checkArchitecture(challengeMetadata, projectDir) {
  const patternsRequired = challengeMetadata.patternsRequired || [];
  const filesToCheck = challengeMetadata.filesToCheck || [];
  
  if (patternsRequired.length === 0) {
    return {
      score: 100,
      passed: true,
      details: []
    };
  }

  const results = {
    score: 0,
    passed: false,
    patternsFound: [],
    patternsMissing: [],
    details: []
  };

  // Aggregate: a pattern "passes" if found in at least one file (project-level)
  const foundAnywhere = new Set();

  for (const file of filesToCheck) {
    const filePath = join(projectDir, file);
    
    if (!existsSync(filePath)) {
      results.details.push({
        file,
        error: 'File does not exist',
        patternsFound: [],
        patternsMissing: patternsRequired
      });
      continue;
    }

    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      const fileResults = checkFileForPatterns(fileContent, patternsRequired, file);
      fileResults.patternsFound.forEach(p => foundAnywhere.add(p));
      results.details.push({
        file,
        patternsFound: fileResults.patternsFound,
        patternsMissing: fileResults.patternsMissing
      });
    } catch (error) {
      results.details.push({
        file,
        error: error.message,
        patternsFound: [],
        patternsMissing: patternsRequired
      });
    }
  }

  // Score = (required patterns found in at least one file) / total required
  patternsRequired.forEach(p => {
    if (foundAnywhere.has(p)) results.patternsFound.push(p);
    else results.patternsMissing.push(p);
  });
  const requiredFoundCount = results.patternsFound.length;
  results.score = patternsRequired.length > 0
    ? Math.round((requiredFoundCount / patternsRequired.length) * 100 * 10) / 10
    : 100;
  results.passed = results.score >= 80;

  return results;
}

function checkFileForPatterns(content, patternsRequired, fileName) {
  const patternsFound = [];
  const patternsMissing = [];

  try {
    const ast = parse(content, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx', 'decorators-legacy', 'classProperties']
    });

    const foundPatterns = new Set();

    traverse(ast, {
      CallExpression(path) {
        const calleeName = path.node.callee.name;
        if (calleeName === 'useState') foundPatterns.add('useState');
        if (calleeName === 'useReducer') foundPatterns.add('useState');
        if (calleeName === 'createContext') foundPatterns.add('createContext');
        if (calleeName === 'useContext') foundPatterns.add('useContext');
        if (calleeName && calleeName.startsWith('use')) foundPatterns.add('customHook');
        const methods = ['map', 'filter', 'reduce', 'forEach'];
        if (path.node.callee.property && methods.includes(path.node.callee.property.name)) {
          foundPatterns.add('arrayMethods');
        }
      },

      FunctionDeclaration(path) {
        if (path.node.id && /^[A-Z]/.test(path.node.id.name)) {
          foundPatterns.add('functionalComponent');
        }
        if (path.node.params.length > 0) {
          foundPatterns.add('props');
        }
      },

      ExportDefaultDeclaration(path) {
        if (path.node.declaration.type === 'FunctionDeclaration') {
          const func = path.node.declaration;
          if (func.id && /^[A-Z]/.test(func.id.name)) {
            foundPatterns.add('functionalComponent');
          }
          if (func.params.length > 0) {
            foundPatterns.add('props');
          }
        }
      },

      ArrowFunctionExpression(path) {
        const parent = path.parent;
        if (parent.type === 'VariableDeclarator' && parent.id && /^[A-Z]/.test(parent.id.name)) {
          foundPatterns.add('functionalComponent');
        }
        if (path.node.params.length > 0) {
          foundPatterns.add('props');
        }
      },

      JSXElement(path) {
        const nameNode = path.node.openingElement.name;
        const name = nameNode?.name ?? (nameNode?.type === 'JSXIdentifier' ? nameNode.name : null);
        if (name === 'Provider') foundPatterns.add('Provider');
        if (name === 'input' || name === 'textarea') {
          const openingElement = path.node.openingElement;
          const getAttrName = (attr) => attr.name?.name ?? (attr.name?.type === 'JSXIdentifier' ? attr.name.name : null);
          const hasValue = openingElement.attributes.some(attr => getAttrName(attr) === 'value');
          const hasOnChange = openingElement.attributes.some(attr => getAttrName(attr) === 'onChange');
          if (hasValue && hasOnChange) foundPatterns.add('controlledComponents');
        }
      },

      MemberExpression(path) {
        if (path.node.object.name === 'localStorage') {
          foundPatterns.add('localStorage');
        }
      },

      ConditionalExpression() {
        foundPatterns.add('conditionalRendering');
      },

      LogicalExpression(path) {
        if (path.node.operator === '&&' || path.node.operator === '||') {
          foundPatterns.add('conditionalRendering');
        }
      }
    });

    // Fallbacks for AST edge cases
    if (patternsRequired.includes('functionalComponent') && !foundPatterns.has('functionalComponent')) {
      if (/function\s+[A-Z][A-Za-z0-9]*\s*\(/.test(content) || /const\s+[A-Z][A-Za-z0-9]*\s*=\s*(?:\([^)]*\)\s*=>|function)/.test(content)) {
        foundPatterns.add('functionalComponent');
      }
    }
    if (patternsRequired.includes('props') && !foundPatterns.has('props')) {
      if (/props/i.test(content) || /function\s+[A-Z][A-Za-z0-9]*\s*\([^)]+\)/.test(content)) {
        foundPatterns.add('props');
      }
    }
    if (patternsRequired.includes('controlledComponents') && !foundPatterns.has('controlledComponents')) {
      if (/value=\s*\{/.test(content) && /onChange=\s*\{/.test(content)) {
        foundPatterns.add('controlledComponents');
      }
    }
    if (patternsRequired.includes('customHook') && !foundPatterns.has('customHook')) {
      if (/use[A-Za-z]+\s*[(<]/.test(content)) {
        foundPatterns.add('customHook');
      }
    }

    for (const pattern of patternsRequired) {
      if (foundPatterns.has(pattern)) {
        patternsFound.push(pattern);
      } else {
        patternsMissing.push(pattern);
      }
    }

  } catch (error) {
    // If parsing fails, try simple string matching and regex fallbacks
    const fallbackFound = new Set();
    if (patternsRequired.includes('functionalComponent')) {
      if (/function\s+[A-Z][A-Za-z0-9]*\s*\(/.test(content) || /const\s+[A-Z][A-Za-z0-9]*\s*=\s*(?:\([^)]*\)\s*=>|function)/.test(content)) {
        fallbackFound.add('functionalComponent');
      }
    }
    if (patternsRequired.includes('props')) {
      if (/props/i.test(content) || /function\s+[A-Z][A-Za-z0-9]*\s*\([^)]+\)/.test(content)) {
        fallbackFound.add('props');
      }
    }
    if (patternsRequired.includes('controlledComponents')) {
      if (/value=\s*\{/.test(content) && /onChange=\s*\{/.test(content)) {
        fallbackFound.add('controlledComponents');
      }
    }
    if (patternsRequired.includes('useState')) {
      if (/useState\s*\(/.test(content) || /useReducer\s*\(/.test(content)) fallbackFound.add('useState');
    }
    if (patternsRequired.includes('arrayMethods')) {
      if (/\.map\s*\(/.test(content) || /\.filter\s*\(/.test(content)) fallbackFound.add('arrayMethods');
    }
    if (patternsRequired.includes('useRef')) {
      if (/useRef\s*\(/.test(content)) fallbackFound.add('useRef');
    }
    if (patternsRequired.includes('customHook')) {
      if (/use[A-Za-z]+\s*[(<]/.test(content)) fallbackFound.add('customHook');
    }

    for (const pattern of patternsRequired) {
      if (fallbackFound.has(pattern) || content.includes(pattern) || content.includes(pattern.replace(/([A-Z])/g, '-$1').toLowerCase())) {
        patternsFound.push(pattern);
      } else {
        patternsMissing.push(pattern);
      }
    }
  }

  return { patternsFound, patternsMissing };
}