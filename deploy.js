#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Genscape.art Deployment Helper\n');

// Check if dist folder exists
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.log('❌ Build not found. Running build first...\n');
  try {
    execSync('pnpm run build:web', { stdio: 'inherit' });
    console.log('\n✅ Build completed successfully!\n');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Fix paths for better hosting compatibility
console.log('🔧 Fixing paths for hosting compatibility...');
try {
  execSync('node fix-paths.js', { stdio: 'inherit' });
} catch (error) {
  console.warn('⚠️ Could not fix paths:', error.message);
}

// Create _redirects file for Netlify
const redirectsPath = path.join(distPath, '_redirects');
if (!fs.existsSync(redirectsPath)) {
  fs.writeFileSync(redirectsPath, '/*    /index.html   200\n');
  console.log('✅ Created _redirects file for Netlify');
}

// Create vercel.json for Vercel
const vercelConfigPath = path.join(distPath, 'vercel.json');
if (!fs.existsSync(vercelConfigPath)) {
  const vercelConfig = {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  };
  fs.writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 2));
  console.log('✅ Created vercel.json for Vercel');
}

// Create .htaccess for Apache
const htaccessPath = path.join(distPath, '.htaccess');
if (!fs.existsSync(htaccessPath)) {
  const htaccessContent = `Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QR,L]
`;
  fs.writeFileSync(htaccessPath, htaccessContent);
  console.log('✅ Created .htaccess for Apache');
}

// Get build info
const indexPath = path.join(distPath, 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');
const jsMatch = indexContent.match(/entry-([a-f0-9]+)\.js/);
const jsHash = jsMatch ? jsMatch[1] : 'unknown';

console.log('\n📊 Build Information:');
console.log(`   Hash: ${jsHash}`);
console.log(`   Location: ${distPath}`);

// Calculate total size
function getDirectorySize(dirPath) {
  let totalSize = 0;
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      totalSize += getDirectorySize(filePath);
    } else {
      totalSize += stats.size;
    }
  }
  
  return totalSize;
}

const totalSize = getDirectorySize(distPath);
const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
console.log(`   Total Size: ${sizeMB} MB`);

console.log('\n🌐 Deployment Options:');
console.log('   1. Netlify: Drag & drop the dist folder to netlify.com/drop');
console.log('   2. Vercel: Run "vercel" in the dist folder');
console.log('   3. GitHub Pages: Push dist contents to gh-pages branch');
console.log('   4. Firebase: Run "firebase deploy" after setup');

console.log('\n📁 Files ready for deployment:');
const files = fs.readdirSync(distPath);
files.forEach(file => {
  const filePath = path.join(distPath, file);
  const stats = fs.statSync(filePath);
  const type = stats.isDirectory() ? '📁' : '📄';
  console.log(`   ${type} ${file}`);
});

console.log('\n✅ Deployment files are ready!');
console.log('📖 See DEPLOYMENT_GUIDE.md for detailed instructions');
console.log('\n🚀 Happy deploying!');
