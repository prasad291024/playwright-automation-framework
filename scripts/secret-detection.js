#!/usr/bin/env node
/**
 * Secret detection script for pre-commit hook
 * Scans staged files for potential secrets and exits with error code if found
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Patterns that might indicate secrets
const secretPatterns = [
  // Passwords
  /password\s*[:=]\s*['"][^"'\\s]{3,}['"]/i,
  // API keys
  /api[_-]?key\s*[:=]\s*['"][^"'\\s]{10,}['"]/i,
  // Tokens
  /token\s*[:=]\s*['"][^"'\\s]{10,}['"]/i,
  // Secret keys
  /secret[_-]?key\s*[:=]\s*['"][^"'\\s]{10,}['"]/i,
  // Authorization headers
  /authorization\s*[:=]\s*['"]Bearer\s+[^"'\\s]{10,}['"]/i,
  // AWS keys
  /AKIA[0-9A-Z]{16}/g,
  // Generic high-entropy strings (simplified)
  /['"][A-Za-z0-9\-_]{32,}['"]/g,
];

// Files to exclude from scanning
const excludePatterns = [
  /\.md$/,
  /\.json$/, // config files might have legitimate values
  /\/node_modules\//,
  /\/dist\//,
  /\/build\//,
  /\.env\.example$/, // example files are expected to have placeholders
  /test-data\/users\.ts$/, // Our test data files now use env vars with fallbacks
];

// Get staged files
let stagedFiles;
try {
  const output = execSync('git diff --cached --name-only --diff-filter=ACM').toString();
  stagedFiles = output
    .trim()
    .split('\n')
    .filter((file) => file.trim() !== '');
} catch (error) {
  console.error('Error getting staged files:', error.message);
  process.exit(1);
}

if (stagedFiles.length === 0) {
  console.log('No staged files to check');
  process.exit(0);
}

let foundSecrets = false;

for (const file of stagedFiles) {
  // Skip excluded files
  const shouldExclude = excludePatterns.some((pattern) => pattern.test(file));
  if (shouldExclude) {
    continue;
  }

  // Only check text-based files
  if (!file.match(/\.(ts|js|tsx|jsx|html|css|scss|yml|yaml|env|txt|md)$/)) {
    continue;
  }

  try {
    const fileContent = fs.readFileSync(file, 'utf8');

    for (const pattern of secretPatterns) {
      const matches = fileContent.match(pattern);
      if (matches) {
        // Filter out matches that are clearly not secrets (like variable names, etc.)
        const filteredMatches = matches.filter((match) => {
          // Skip if it's just a variable name or common non-secret text
          const lowercaseMatch = match.toLowerCase();
          return (
            !['password', 'api_key', 'token', 'secret_key', 'authorization', 'bearer', 'akia'].some(
              (keyword) => lowercaseMatch.includes(keyword),
            ) ||
            // Or if it looks like a placeholder/example value
            /(example|test|dummy|placeholder|change_me|your_|<|>|\$\{)/i.test(match)
          );
        });

        if (filteredMatches.length > 0) {
          console.error(`⚠️  Potential secret detected in ${file}:`);
          filteredMatches.forEach((match, index) => {
            // Mask the actual value in output
            const masked = match.replace(/["'][^"']{3,}["']/g, (match) => {
              const quote = match[0];
              const length = match.length - 2; // subtract the two quotes
              return quote + '*'.repeat(length) + quote;
            });
            console.error(`   Line ${index + 1}: ${masked}`);
          });
          foundSecrets = true;
        }
      }
    }
  } catch (error) {
    console.error(`Error reading file ${file}:`, error.message);
    // Don't fail on read errors - just warn
  }
}

if (foundSecrets) {
  console.error('\n❌ Secret detection failed. Please remove any secrets before committing.');
  console.error("💡 Use environment variables or the framework's secret management system.");
  process.exit(1);
} else {
  console.log('✅ Secret detection passed - no secrets found in staged files');
  process.exit(0);
}
