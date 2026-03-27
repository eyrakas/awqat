#!/usr/bin/env node

/**
 * Awqat Setup - Quick initialization script
 * Run this to check your environment and get started
 */

const fs = require('fs');
const path = require('path');

console.log('\n🕌 Awqat - Prayer Times PWA Setup\n');
console.log('Checking your environment...\n');

// Check Node version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].slice(1));

if (majorVersion < 18) {
  console.log('❌ Node.js version 18 or higher required');
  console.log(`   Current version: ${nodeVersion}`);
  process.exit(1);
} else {
  console.log(`✅ Node.js ${nodeVersion}`);
}

// Check for npm
try {
  const npmVersion = require('child_process')
    .execSync('npm --version')
    .toString()
    .trim();
  console.log(`✅ npm ${npmVersion}`);
} catch {
  console.log('❌ npm not found');
  process.exit(1);
}

// Check project files
console.log('\nChecking project files...\n');

const requiredFiles = [
  'package.json',
  'vite.config.ts',
  'tsconfig.json',
  'src/App.tsx',
  'index.html',
  'public/manifest.json'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${file}`);
  if (!exists) allFilesExist = false;
});

if (!allFilesExist) {
  console.log('\n⚠️  Some files are missing. Please check your installation.');
  process.exit(1);
}

console.log('\n✅ All checks passed!\n');
console.log('Next steps:\n');
console.log('1. Install dependencies:');
console.log('   npm install\n');
console.log('2. Start development server:');
console.log('   npm run dev\n');
console.log('3. Build for production:');
console.log('   npm run build\n');
console.log('4. Deploy to GitHub:');
console.log('   npm run deploy\n');
console.log('For more info, see: DEPLOYMENT.md\n');
console.log('🚀 Ready to go!\n');
