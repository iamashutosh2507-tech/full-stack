import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

/**
 * Runs tests for a specific challenge
 */
export async function runTests(challengeId, projectDir) {
  const testFile = join(projectDir, 'tests', `challenge-${challengeId.split('-')[0]}.test.tsx`);
  
  if (!existsSync(testFile)) {
    return {
      score: 0,
      passed: false,
      error: `Test file not found: ${testFile}`,
      details: []
    };
  }

  try {
    // Run vitest for the specific test file
    const output = execSync(
      `npm test -- "${testFile}" --run --reporter=json`,
      { 
        cwd: projectDir,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe']
      }
    );

    const raw = (output || '') + '';
    const jsonMatch = raw.match(/\{[\s\S]*"numTotalTests"[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : raw;
    const testResults = JSON.parse(jsonStr);
    const totalTests = testResults.numTotalTests || 0;
    const passedTests = testResults.numPassedTests || 0;
    const failedTests = testResults.numFailedTests || 0;

    const score = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

    return {
      score: Math.round(score * 10) / 10,
      passed: failedTests === 0,
      totalTests,
      passedTests,
      failedTests,
      details: testResults.testResults || []
    };
  } catch (error) {
    try {
      const raw = (error.stdout || error.stderr || error.output?.join?.('') || '') + '';
      const jsonMatch = raw.match(/\{[\s\S]*"numTotalTests"[\s\S]*\}/);
      const errorOutput = jsonMatch ? jsonMatch[0] : raw;
      const testResults = JSON.parse(errorOutput);
      const totalTests = testResults.numTotalTests || 0;
      const passedTests = testResults.numPassedTests || 0;
      const score = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

      return {
        score: Math.round(score * 10) / 10,
        passed: false,
        totalTests,
        passedTests,
        failedTests: testResults.numFailedTests || 0,
        details: testResults.testResults || [],
        error: error.message
      };
    } catch {
      return {
        score: 0,
        passed: false,
        error: error.message,
        details: []
      };
    }
  }
}
