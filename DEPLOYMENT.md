# Netlify Deployment Guide

This guide will help you deploy your React + Vite application to Netlify.

## Prerequisites

- A Netlify account
- Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Automatic Deployment (Recommended)

1. **Connect to Git Repository**
   - Log in to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Choose your Git provider and select your repository

2. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Base directory**: Leave empty (or specify if your frontend is in a subdirectory)

3. **Environment Variables** (if needed)
   - Go to Site settings > Environment variables
   - Add any `VITE_*` environment variables your app needs
   - Example:
     ```
     VITE_API_URL=https://your-backend-api.com
     VITE_APP_ENV=production
     ```

4. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically build and deploy your site

### 2. Manual Deployment

1. **Build Locally**
   ```bash
   npm install
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to Netlify's deploy area
   - Or use Netlify CLI:
     ```bash
     npm install -g netlify-cli
     netlify deploy --prod --dir=dist
     ```

## Configuration Files

The following files have been added to optimize your deployment:

### `netlify.toml`
- Configures build settings and redirects
- Sets up security headers
- Optimizes caching for static assets

### `public/_redirects`
- Handles SPA routing (all routes fall back to index.html)

### `public/_headers`
- Adds security headers
- Configures caching for better performance

## Environment Variables

If your application uses environment variables, make sure to:

1. **Prefix with `VITE_`** for client-side variables
2. **Add them in Netlify's dashboard** under Site settings > Environment variables
3. **Never commit sensitive values** to your repository

Example environment variables:
```env
VITE_API_URL=https://your-backend-api.com
VITE_APP_ENV=production
VITE_ANALYTICS_ID=your-analytics-id
```

## Custom Domain (Optional)

1. Go to Site settings > Domain management
2. Click "Add custom domain"
3. Follow the DNS configuration instructions

## Troubleshooting

### Build Failures
- Check the build logs in Netlify's dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Routing Issues
- Ensure `_redirects` file is in the `public` directory
- Check that all routes fall back to `index.html`

### Environment Variables
- Verify variables are prefixed with `VITE_`
- Check that variables are set in Netlify's dashboard
- Rebuild after adding new environment variables

## Performance Optimization

The deployment is configured with:
- **Code splitting** for better loading performance
- **Caching headers** for static assets
- **Security headers** for protection
- **Gzip compression** (handled by Netlify)

## Backend Deployment

Note: This guide covers frontend deployment only. For the backend:
- Consider deploying to platforms like Heroku, Railway, or AWS
- Update the frontend's API URL to point to your deployed backend
- Ensure CORS is properly configured on the backend

## Support

For more information:
- [Netlify Documentation](https://docs.netlify.com)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router Deployment](https://reactrouter.com/en/main/start/overview#deployment) 