# 🚨 Troubleshooting 500 Server Error

## Problem Description
You're seeing a **500 Internal Server Error** when trying to access your deployed Genscape.art application. This indicates a server-side issue rather than a client-side problem.

## ✅ Quick Fixes Applied

### 1. **Path Issues Fixed**
- ✅ Changed absolute paths (`/favicon.ico`) to relative paths (`./favicon.ico`)
- ✅ Fixed JavaScript bundle paths (`/_expo/...` → `./_expo/...`)
- ✅ Created test.html for debugging file access

### 2. **Deployment Files Added**
- ✅ `_redirects` file for Netlify
- ✅ `vercel.json` file for Vercel
- ✅ `.htaccess` file for Apache
- ✅ `test.html` for debugging

## 🔍 Diagnosis Steps

### Step 1: Test File Access
1. **Access the test page first**: `https://yourdomain.com/test.html`
2. **Check if static files load**: The test page will automatically check file access
3. **Look for specific error messages**: Note which files fail to load

### Step 2: Check Server Configuration
The 500 error typically indicates one of these issues:

#### **A. Server Doesn't Support SPA Routing**
**Problem**: Server returns 500 when trying to serve `index.html` for all routes

**Solution**: Configure server redirects
- **Netlify**: Ensure `_redirects` file is uploaded
- **Vercel**: Ensure `vercel.json` file is uploaded  
- **Apache**: Ensure `.htaccess` file is uploaded
- **Nginx**: Configure try_files directive

#### **B. File Permission Issues**
**Problem**: Server can't read uploaded files

**Solution**: Check file permissions
```bash
# On Linux/Unix servers
chmod 644 *.html *.js *.css *.json
chmod 755 directories
```

#### **C. Missing Files**
**Problem**: Required files weren't uploaded correctly

**Solution**: Verify all files are present
- ✅ `index.html`
- ✅ `favicon.ico`
- ✅ `_expo/static/js/web/entry-*.js`
- ✅ `assets/` folder
- ✅ Routing config files

#### **D. Server Resource Limits**
**Problem**: JavaScript bundle too large for server limits

**Solution**: Check server limits
- File size limits (our bundle is ~3MB)
- Memory limits
- Execution time limits

## 🌐 Platform-Specific Solutions

### Netlify
```bash
# 1. Ensure _redirects file exists in root
/*    /index.html   200

# 2. Check build settings
Build command: pnpm run build:web
Publish directory: dist

# 3. Check function logs in Netlify dashboard
```

### Vercel
```json
// vercel.json should contain:
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### GitHub Pages
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build:web
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Apache (.htaccess)
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QR,L]

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

### Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

## 🔧 Alternative Deployment Methods

### Method 1: Use a Different Platform
If one platform gives 500 errors, try another:

1. **Netlify** (Recommended for beginners)
   - Drag & drop the `dist` folder to netlify.com/drop
   - Automatic HTTPS and CDN

2. **Vercel** (Great for developers)
   - Connect GitHub repository
   - Automatic deployments

3. **Firebase Hosting** (Google ecosystem)
   - `firebase init hosting`
   - `firebase deploy`

### Method 2: Use a Simple HTTP Server
For testing purposes, use a basic server:

```bash
# Python (if installed)
cd dist && python -m http.server 8000

# Node.js serve package
npx serve dist -p 8000

# PHP (if installed)
cd dist && php -S localhost:8000
```

### Method 3: Use a CDN
Upload to a CDN service:
- AWS S3 + CloudFront
- Azure Static Web Apps
- Google Cloud Storage

## 🐛 Debugging Commands

### Check Build Integrity
```bash
# Verify all files exist
node -e "
const fs = require('fs');
const files = ['dist/index.html', 'dist/favicon.ico', 'dist/_expo/static/js/web'];
files.forEach(f => console.log(f, fs.existsSync(f) ? '✅' : '❌'));
"

# Check file sizes
ls -la dist/
ls -la dist/_expo/static/js/web/
```

### Test Locally
```bash
# Run the deploy helper
pnpm run deploy

# Test with a simple server
cd dist && python -m http.server 8000
# Then open http://localhost:8000
```

## 📞 Getting Help

### Information to Collect
When asking for help, provide:

1. **Hosting Platform**: Which service you're using
2. **Error Details**: Exact error message and status code
3. **Server Logs**: Any available server logs
4. **File List**: Confirm all files were uploaded
5. **Test Results**: Results from accessing test.html

### Common Error Patterns

**"500 Internal Server Error"**
- Usually server configuration issue
- Check routing configuration
- Verify file permissions

**"404 Not Found"**
- Files not uploaded correctly
- Wrong publish directory
- Missing routing configuration

**"403 Forbidden"**
- Permission issues
- Directory listing disabled
- Authentication required

## ✅ Success Checklist

Before deployment:
- [ ] Run `pnpm run deploy` to prepare files
- [ ] Verify all files in `dist/` folder
- [ ] Test locally with simple HTTP server
- [ ] Check that `test.html` works
- [ ] Configure server routing for SPA
- [ ] Upload all files including config files
- [ ] Test the deployed application

## 🚀 Next Steps

1. **Try the test page**: Access `test.html` first
2. **Check server logs**: Look for specific error details
3. **Try a different platform**: If one fails, try another
4. **Contact platform support**: With specific error details

The 500 error is typically a server configuration issue, not a problem with your application code. The fixes applied should resolve most common hosting issues.
