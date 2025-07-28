# 🚨 TextLit.us 500 Error - Specific Fix Guide

## Problem Identified
The 500 error is coming from `textlit.us` hosting platform, not from your application files. This indicates a **server-side configuration issue** on the hosting platform.

## 🔍 Immediate Diagnosis Steps

### Step 1: Check Server Status
The error `GET https://textlit.us/ 500 (Internal Server Error)` suggests:
- The server is receiving requests
- But failing to process them properly
- This is a server configuration issue, not a file issue

### Step 2: Verify File Upload
First, let's confirm your files are uploaded correctly:

1. **Check if files exist**:
   - Try accessing: `https://textlit.us/test.html`
   - Try accessing: `https://textlit.us/favicon.ico`
   - Try accessing: `https://textlit.us/_expo/static/js/web/entry-ab0a117741972206b01eda7d6d06a977.js`

2. **If files return 404**: Files weren't uploaded correctly
3. **If files return 500**: Server configuration issue

## 🔧 TextLit.us Specific Fixes

### Fix 1: Check Upload Directory
TextLit.us might require files in a specific directory:

**Common directories:**
- `public_html/`
- `www/`
- `htdocs/`
- `web/`

**Solution**: Upload all `dist/` contents to the correct web root directory.

### Fix 2: File Permissions
TextLit.us might have strict file permission requirements:

**Required permissions:**
```bash
# Files should be readable
chmod 644 *.html *.js *.css *.json *.ico

# Directories should be executable
chmod 755 _expo/ assets/
```

### Fix 3: .htaccess Configuration
TextLit.us likely uses Apache. Ensure `.htaccess` is configured correctly:

**Create/update `.htaccess` in web root:**
```apache
# Enable rewrite engine
RewriteEngine On

# Handle Angular/React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QR,L]

# Set proper MIME types
AddType application/javascript .js
AddType text/css .css
AddType application/json .json

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>
```

### Fix 4: PHP Configuration Issues
If TextLit.us runs PHP, there might be PHP errors:

**Check for:**
- PHP version compatibility
- Memory limits
- Execution time limits
- Error reporting settings

**Add to `.htaccess`:**
```apache
# PHP settings (if applicable)
php_value memory_limit 256M
php_value max_execution_time 300
php_value upload_max_filesize 50M
php_value post_max_size 50M
```

## 🚀 Alternative Solutions

### Solution 1: Use a Different Hosting Platform
If TextLit.us continues to have issues, try these reliable alternatives:

#### **Netlify (Recommended)**
```bash
# 1. Go to netlify.com/drop
# 2. Drag your dist folder
# 3. Instant deployment with automatic HTTPS
```

#### **Vercel**
```bash
# 1. Go to vercel.com
# 2. Import from GitHub or drag dist folder
# 3. Automatic SPA routing configuration
```

#### **GitHub Pages**
```bash
# 1. Create a new repository
# 2. Upload dist contents to gh-pages branch
# 3. Enable Pages in repository settings
```

### Solution 2: Contact TextLit.us Support
Provide them with:
- Error message: "500 Internal Server Error"
- File list: All files from dist folder
- Request: Enable SPA routing for React applications
- Configuration: Need .htaccess support or equivalent

### Solution 3: Use Subdirectory Deployment
If root deployment fails, try deploying to a subdirectory:

1. **Create subdirectory**: `genscape/` or `app/`
2. **Upload files there**: `https://textlit.us/genscape/`
3. **Update base path**: May need to rebuild with different base URL

## 🔧 Debug Commands for TextLit.us

### Check Server Response
```bash
# Test server response
curl -I https://textlit.us/

# Check specific files
curl -I https://textlit.us/test.html
curl -I https://textlit.us/index.html
curl -I https://textlit.us/favicon.ico
```

### Check File Upload
```bash
# Verify files are uploaded correctly
# Use FTP client or file manager to confirm:
# - index.html exists
# - _expo/ directory exists
# - assets/ directory exists
# - .htaccess file exists
```

## 📋 TextLit.us Deployment Checklist

### Pre-Upload
- [ ] Files prepared with `pnpm run deploy`
- [ ] All files in dist/ folder ready
- [ ] .htaccess file included
- [ ] File permissions checked

### Upload Process
- [ ] Upload to correct directory (public_html, www, etc.)
- [ ] Maintain folder structure
- [ ] Upload .htaccess file
- [ ] Set correct file permissions

### Post-Upload Testing
- [ ] Test static file access: `https://textlit.us/favicon.ico`
- [ ] Test debug page: `https://textlit.us/test.html`
- [ ] Test main app: `https://textlit.us/index.html`
- [ ] Test routing: `https://textlit.us/content-manager`

## 🚨 Emergency Backup Plan

If TextLit.us continues to fail:

### Quick Deploy to Netlify
```bash
# 1. Go to https://netlify.com/drop
# 2. Drag the dist folder
# 3. Get instant working deployment
# 4. Use as temporary solution while fixing TextLit.us
```

### Quick Deploy to Vercel
```bash
# 1. Install Vercel CLI: npm i -g vercel
# 2. cd dist
# 3. vercel --prod
# 4. Get instant deployment
```

## 📞 Getting Help from TextLit.us

### Information to Provide
1. **Error Message**: "500 Internal Server Error on GET /"
2. **File Structure**: List of uploaded files
3. **Application Type**: React Single Page Application (SPA)
4. **Requirements**: Need SPA routing support
5. **Configuration**: .htaccess file for Apache rewrite rules

### Questions to Ask
1. What is the correct upload directory?
2. Do you support .htaccess files?
3. What are the file permission requirements?
4. Do you support Single Page Applications?
5. Are there any server-side restrictions?

## ✅ Expected Resolution

Once properly configured on TextLit.us:
- ✅ `https://textlit.us/` loads the main application
- ✅ `https://textlit.us/test.html` shows file access test
- ✅ All routes work correctly (content-manager, etc.)
- ✅ Media upload functionality works
- ✅ No more 500 errors

## 🎯 Next Steps

1. **Try accessing test.html**: `https://textlit.us/test.html`
2. **Check file upload**: Verify all dist files are uploaded
3. **Update .htaccess**: Use the configuration provided above
4. **Contact TextLit.us support**: If issues persist
5. **Consider alternative hosting**: Netlify/Vercel as backup

The 500 error is definitely a server configuration issue on TextLit.us, not a problem with your application files. The fixes above should resolve it, or you can quickly deploy to a more reliable platform like Netlify.
