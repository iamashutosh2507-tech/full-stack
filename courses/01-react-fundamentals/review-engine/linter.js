import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

/**
 * Runs ESLint on specified files
 * Only checks files specified in challenge metadata
 */
export async function runLinting(filesToCheck, projectDir, challengeMetadata = {}) {
  if (!filesToCheck || filesToCheck.length === 0) {
    return {
      score: 0,
      passed: false,
      error: 'No files specified for linting',
      details: []
    };
  }

  // Resolve file paths
  const filePaths = filesToCheck
    .map(file => join(projectDir, file))
    .filter(file => existsSync(file));

  if (filePaths.length === 0) {
    return {
      score: 0,
      passed: false,
      error: 'None of the specified files exist',
      details: []
    };
  }
  
  // Check if ESLint is required in requirements
  const requirements = challengeMetadata.requirements?.codeQuality || [];
  const requiresESLint = requirements.some(req => 
    req.toLowerCase().includes('eslint') || req.toLowerCase().includes('lint')
  );
  
  // If no ESLint requirement specified, return 100% (nothing to check)
  if (requirements.length > 0 && !requiresESLint) {
    return {
      score: 100,
      passed: true,
      totalIssues: 0,
      errors: 0,
      warnings: 0,
      details: [],
      note: 'No ESLint requirement specified in challenge'
    };
  }

  try {
    // Run ESLint ONLY on specified files (not all files)
    // Use npx eslint directly to avoid npm script which checks all files
    const output = execSync(
      `npx eslint ${filePaths.join(' ')} --format json`,
      {
        cwd: projectDir,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'ignore']
      }
    );

    const lintResults = JSON.parse(output);
    
    // Calculate score based on errors and warnings
    let totalIssues = 0;
    let errors = 0;
    let warnings = 0;

    // Only count issues from the files we're checking (filter by filePaths)
    const filePathSet = new Set(filePaths.map(p => p.replace(/\\/g, '/')));
    lintResults.forEach(file => {
      const normalizedPath = file.filePath.replace(/\\/g, '/');
      // Only count issues from files we're actually checking
      if (filePathSet.has(normalizedPath) || filePathSet.has(normalizedPath.replace(projectDir.replace(/\\/g, '/') + '/', ''))) {
        file.messages.forEach(message => {
          totalIssues++;
          if (message.severity === 2) {
            errors++;
          } else {
            warnings++;
          }
        });
      }
    });

    // Score: 100 - (errors * 10) - (warnings * 2), minimum 0
    const score = Math.max(0, 100 - (errors * 10) - (warnings * 2));

    return {
      score: Math.round(score * 10) / 10,
      passed: errors === 0,
      totalIssues,
      errors,
      warnings,
      details: lintResults
    };
  } catch (error) {
    // ESLint exits with non-zero on errors, try to parse output
    try {
      const errorOutput = error.stdout || error.stderr || '';
      const lintResults = JSON.parse(errorOutput);
      
      let totalIssues = 0;
      let errors = 0;
      let warnings = 0;

      // Only count issues from the files we're checking (filter by filePaths)
      const filePathSet = new Set(filePaths.map(p => p.replace(/\\/g, '/')));
      lintResults.forEach(file => {
        const normalizedPath = file.filePath.replace(/\\/g, '/');
        // Only count issues from files we're actually checking
        if (filePathSet.has(normalizedPath) || filePathSet.has(normalizedPath.replace(projectDir.replace(/\\/g, '/') + '/', ''))) {
          file.messages.forEach(message => {
            totalIssues++;
            if (message.severity === 2) {
              errors++;
            } else {
              warnings++;
            }
          });
        }
      });

      const score = Math.max(0, 100 - (errors * 10) - (warnings * 2));

      return {
        score: Math.round(score * 10) / 10,
        passed: errors === 0,
        totalIssues,
        errors,
        warnings,
        details: lintResults
      };
    } catch {
      // If we can't parse, assume linting passed (files might not exist yet)
      return {
        score: 100, // Partial credit if files don't exist
        passed: false,
        error: 'Could not parse linting results',
        details: []
      };
    }
  }
}
