#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing paths for better hosting compatibility...\n');

const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('❌ Build not found. Please run "pnpm run build:web" first.');
  process.exit(1);
}

// Read the index.html file
let indexContent = fs.readFileSync(indexPath, 'utf8');

console.log('📄 Original index.html paths:');
console.log('   Favicon: /favicon.ico');
console.log('   JS Bundle: /_expo/static/js/web/entry-*.js');

// Fix the favicon path
indexContent = indexContent.replace(
  'href="/favicon.ico"',
  'href="./favicon.ico"'
);

// Fix the JavaScript bundle path
indexContent = indexContent.replace(
  'src="/_expo/static/js/web/',
  'src="./_expo/static/js/web/'
);

// Write the fixed content back
fs.writeFileSync(indexPath, indexContent);

console.log('\n✅ Fixed index.html paths:');
console.log('   Favicon: ./favicon.ico');
console.log('   JS Bundle: ./_expo/static/js/web/entry-*.js');

// Also create a simple test HTML file for debugging
const testHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Genscape.art - Test Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .status {
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .info { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
        .warning { background: #fff3cd; color: #856404; border: 1px solid #ffeaa7; }
        button {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 10px 5px;
        }
        button:hover { background: #0056b3; }
        .file-list {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        .file-item {
            padding: 5px 0;
            border-bottom: 1px solid #dee2e6;
        }
        .file-item:last-child { border-bottom: none; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Genscape.art - Deployment Test</h1>
        
        <div class="status success">
            <strong>✅ Static Files Loaded Successfully!</strong><br>
            This page confirms that your web server can serve static HTML files.
        </div>

        <div class="status info">
            <strong>📊 Build Information:</strong><br>
            • Build Date: ${new Date().toISOString()}<br>
            • Platform: Web (HTML/CSS/JavaScript)<br>
            • Framework: Expo + React Native Web<br>
            • Status: Ready for deployment
        </div>

        <h2>🔧 Deployment Checklist</h2>
        <div class="file-list">
            <div class="file-item">✅ index.html - Main application file</div>
            <div class="file-item">✅ favicon.ico - App icon</div>
            <div class="file-item">✅ _expo/static/js/web/ - JavaScript bundles</div>
            <div class="file-item">✅ assets/ - Static assets and fonts</div>
            <div class="file-item">✅ _redirects - Netlify routing config</div>
            <div class="file-item">✅ vercel.json - Vercel routing config</div>
            <div class="file-item">✅ .htaccess - Apache routing config</div>
        </div>

        <h2>🌐 Next Steps</h2>
        <div class="status warning">
            <strong>⚠️ Important:</strong> This is a test page. To access the full application, navigate to the main index.html file.
        </div>

        <button onclick="window.location.href='./index.html'">
            🚀 Launch Genscape.art Application
        </button>

        <button onclick="testFiles()">
            🔍 Test File Access
        </button>

        <div id="test-results"></div>

        <h2>📞 Troubleshooting</h2>
        <p><strong>If you see a 500 error:</strong></p>
        <ul>
            <li>Check that all files are uploaded correctly</li>
            <li>Verify server supports Single Page Applications (SPA)</li>
            <li>Ensure routing redirects are configured</li>
            <li>Check server logs for specific error details</li>
        </ul>

        <p><strong>Common hosting platform fixes:</strong></p>
        <ul>
            <li><strong>Netlify:</strong> Ensure _redirects file is present</li>
            <li><strong>Vercel:</strong> Ensure vercel.json file is present</li>
            <li><strong>Apache:</strong> Ensure .htaccess file is present</li>
            <li><strong>GitHub Pages:</strong> May need custom domain for SPA routing</li>
        </ul>
    </div>

    <script>
        function testFiles() {
            const results = document.getElementById('test-results');
            results.innerHTML = '<h3>🔍 Testing File Access...</h3>';
            
            const filesToTest = [
                './favicon.ico',
                './_expo/static/js/web/entry-ab0a117741972206b01eda7d6d06a977.js',
                './metadata.json'
            ];

            filesToTest.forEach(file => {
                fetch(file)
                    .then(response => {
                        const status = response.ok ? '✅' : '❌';
                        const statusText = response.ok ? 'OK' : \`Error \${response.status}\`;
                        results.innerHTML += \`<div class="file-item">\${status} \${file} - \${statusText}</div>\`;
                    })
                    .catch(error => {
                        results.innerHTML += \`<div class="file-item">❌ \${file} - Failed to load</div>\`;
                    });
            });
        }

        // Auto-test on page load
        setTimeout(testFiles, 1000);
    </script>
</body>
</html>`;

const testPath = path.join(distPath, 'test.html');
fs.writeFileSync(testPath, testHtmlContent);

console.log('\n✅ Created test.html for debugging');
console.log('\n🌐 Deployment Tips:');
console.log('   1. Upload all files from the dist/ folder');
console.log('   2. Access test.html first to verify file serving');
console.log('   3. Then access index.html for the full application');
console.log('   4. Ensure SPA routing is configured on your server');

console.log('\n🚀 Files ready for deployment!');
