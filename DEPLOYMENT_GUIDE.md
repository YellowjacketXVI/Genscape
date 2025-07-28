# Genscape.art - HTML Deployment Guide

## 🚀 Build Complete

Your Genscape.art application has been successfully built for HTML deployment! The production-ready files are located in the `dist` folder.

## 📁 Build Structure

```
dist/
├── index.html                    # Main HTML file
├── favicon.ico                   # App icon
├── metadata.json                 # App metadata
├── _expo/
│   └── static/
│       └── js/
│           └── web/
│               └── entry-[hash].js  # Main JavaScript bundle (~3MB)
└── assets/
    └── node_modules/             # Static assets and fonts
```

## 🌐 Deployment Options

### Option 1: Static Web Hosting (Recommended)

**Platforms that support this deployment:**
- **Netlify** (Recommended)
- **Vercel** 
- **GitHub Pages**
- **Firebase Hosting**
- **AWS S3 + CloudFront**
- **Azure Static Web Apps**

**Steps:**
1. Zip the entire `dist` folder contents
2. Upload to your hosting platform
3. Set the root directory to serve `index.html`
4. Configure redirects for SPA routing (see below)

### Option 2: Traditional Web Server

**Compatible with:**
- Apache HTTP Server
- Nginx
- IIS
- Any web server that can serve static files

**Steps:**
1. Copy all files from `dist` folder to your web server's document root
2. Configure server for Single Page Application (SPA) routing
3. Ensure HTTPS is enabled for production

## ⚙️ Server Configuration

### For Single Page Application (SPA) Routing

Since this is a React Router application, you need to configure your server to serve `index.html` for all routes.

#### Netlify (_redirects file)
Create a `_redirects` file in the `dist` folder:
```
/*    /index.html   200
```

#### Vercel (vercel.json)
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### Apache (.htaccess)
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QR,L]
```

#### Nginx
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 🔧 Environment Configuration

### Supabase Configuration
The app is configured to use your Supabase project:
- **Project**: Genscape.art (ID: msinxqvqjzlappkumynm)
- **Region**: us-west-1

**Important**: Make sure your Supabase project is configured for production:
1. Update CORS settings to include your domain
2. Configure authentication redirects
3. Review RLS policies for production security

### Environment Variables
The build includes the following configurations:
- Supabase URL and API keys (from your .env files)
- App metadata and routing configuration

## 📊 Build Information

- **Bundle Size**: ~3MB (optimized for production)
- **Framework**: Expo + React Native Web
- **Routing**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: React Context + Hooks
- **Backend**: Supabase (Database + Storage + Auth)

## 🚀 Quick Deploy Commands

### Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy from dist folder
cd dist
netlify deploy --prod --dir .
```

### Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from dist folder
cd dist
vercel --prod
```

### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize and deploy
firebase init hosting
firebase deploy
```

## 🔍 Testing the Build

### Local Testing
To test the build locally, you can use any static file server:

```bash
# Using Python (if installed)
cd dist
python -m http.server 8000

# Using Node.js serve package
npx serve dist

# Using PHP (if installed)
cd dist
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 📱 Features Included

Your deployed application includes:
- ✅ **User Authentication** (Supabase Auth)
- ✅ **Content Manager** with media upload
- ✅ **File Upload** (images, videos, audio)
- ✅ **Storage Management** with real-time metrics
- ✅ **Responsive Design** (mobile and desktop)
- ✅ **Dark/Light Theme** support
- ✅ **Tab Navigation** with multiple screens
- ✅ **Real-time Database** updates

## 🔒 Security Considerations

### Production Checklist
- [ ] Enable HTTPS on your domain
- [ ] Configure Supabase CORS for your domain
- [ ] Review and test RLS policies
- [ ] Set up proper authentication redirects
- [ ] Configure CSP headers if needed
- [ ] Test file upload functionality
- [ ] Verify all API endpoints work

### Supabase Security
- Row Level Security (RLS) is enabled
- Users can only access their own content
- File uploads are secured with proper permissions
- Authentication is handled securely

## 🐛 Troubleshooting

### Common Issues

**1. Blank Page After Deployment**
- Check browser console for errors
- Verify all static assets are loading
- Ensure SPA routing is configured

**2. File Upload Not Working**
- Check Supabase CORS settings
- Verify storage bucket permissions
- Test authentication flow

**3. Authentication Issues**
- Update Supabase auth redirect URLs
- Check site URL configuration
- Verify API keys are correct

**4. Routing Issues**
- Ensure server redirects are configured
- Check that all routes serve index.html
- Verify base URL configuration

## 📞 Support

If you encounter issues during deployment:
1. Check the browser console for errors
2. Verify Supabase configuration
3. Test locally first before deploying
4. Check server logs for any errors

## 🎉 Deployment Complete!

Your Genscape.art application is now ready for production deployment. The `dist` folder contains everything needed to run your application on any static web hosting platform.

**Next Steps:**
1. Choose a hosting platform
2. Upload the `dist` folder contents
3. Configure SPA routing
4. Update Supabase settings for your domain
5. Test all functionality in production

Happy deploying! 🚀
