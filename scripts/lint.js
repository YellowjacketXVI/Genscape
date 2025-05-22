const { execSync } = require('child_process');

try {
  // Run TypeScript in noEmit mode to type-check the project
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('TypeScript checks passed.');
} catch (error) {
  console.error('Linting failed.');
  process.exit(1);
}
