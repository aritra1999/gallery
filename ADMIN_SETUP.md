# Gallery Admin Panel Setup Guide

This guide will help you set up the admin panel for your personal gallery CMS built with SvelteKit 5 and Sanity.

## 🚀 Quick Start

### 1. Environment Configuration

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your configuration:

   ```env
   # Sanity Configuration
   PUBLIC_SANITY_PROJECT_ID=b74xb8a5
   PUBLIC_SANITY_DATASET=production
   PUBLIC_SANITY_API_VERSION=2024-01-01
   SANITY_TOKEN=your_sanity_write_token_here

   # Authentication
   JWT_SECRET=your_jwt_secret_here_change_this_to_something_secure

   # Admin Credentials (default password is "test")
   ADMIN_USERNAME=aritra1999
   ADMIN_PASSWORD_HASH=$2b$10$twDrflZ/3RYhgKjuzYJUDOYYEShxyVK4ifA4HQUCB2ABH1KJcjOKy
   ```

### 2. Get Your Sanity Write Token

1. Go to [Sanity Manage](https://sanity.io/manage)
2. Select your project (`b74xb8a5`)
3. Go to **API** → **Tokens**
4. Create a new token with **Write** permissions
5. Copy the token and add it to your `.env` file as `SANITY_TOKEN`

### 3. Secure Your Installation

1. **Generate a secure JWT secret:**

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   Replace `JWT_SECRET` in your `.env` file with this value.

2. **Change the default password:**
   ```bash
   bun run generate-hash "your_secure_password"
   ```
   Replace `ADMIN_PASSWORD_HASH` in your `.env` file with the generated hash.

### 4. Start the Development Server

```bash
bun install
bun run dev
```

The admin panel will be available at: **http://localhost:5173/admin**

## 🔐 Authentication

### Default Credentials

- **Username:** `aritra1999`
- **Password:** `test`

### Changing Credentials

**To change the username:**

1. Update `ADMIN_USERNAME` in your `.env` file

**To change the password:**

1. Generate a new hash: `bun run generate-hash "your_new_password"`
2. Update `ADMIN_PASSWORD_HASH` in your `.env` file

## 📁 Admin Panel Features

### 🏠 Dashboard

- Overview of all content statistics
- Recent uploads (images, videos, galleries)
- Content breakdown by region
- Quick action buttons

### 📤 Bulk Upload

- **Location Selection:** Searchable dropdowns for country and city
- **Bulk Media Upload:** Drag & drop or browse for multiple images/videos
- **Auto-naming:** Files are automatically titled based on filename
- **Auto-tagging:** All uploads tagged with selected location

### 🖼️ Content Management

- **Images:** View and manage all gallery images
- **Videos:** View and manage all gallery videos
- **Galleries:** Create and organize content collections
- **Regions:** Manage geographical organization

## 🌍 Location System

The admin panel includes a comprehensive location database with:

- **200+ cities** across all continents
- **100+ countries** organized by regions
- **7 major regions:** Europe, Asia, North America, South America, Africa, Oceania, Middle East

### Adding Custom Locations

To add more cities or countries, edit `src/lib/data/locations.ts`:

```typescript
// Add to countries array
{ name: 'New Country', code: 'NC', region: 'Your Region' }

// Add to cities array
{ name: 'New City', country: 'New Country', countryCode: 'NC', region: 'Your Region' }
```

## 🛠️ Technical Details

### Tech Stack

- **Frontend:** SvelteKit 5 + TailwindCSS
- **Icons:** Lucide Svelte
- **Authentication:** JWT with HTTP-only cookies
- **CMS:** Sanity.io
- **Password Hashing:** bcryptjs

### Security Features

- JWT-based authentication
- HTTP-only secure cookies
- Password hashing with bcrypt
- Protected admin routes
- CSRF protection via SvelteKit

### File Upload Process

1. Files are uploaded to Sanity's CDN
2. Document records are created in Sanity
3. Metadata is auto-generated from filename and location
4. Images get automatic alt text for accessibility

## 🚦 Troubleshooting

### Common Issues

**"Invalid credentials" error:**

- Check your username and password
- Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` in `.env`

**"Failed to upload" error:**

- Verify your `SANITY_TOKEN` has write permissions
- Check your internet connection
- Ensure file types are supported (images: jpg, png, gif, webp; videos: mp4, mov, avi)

**Pages not loading:**

- Ensure all environment variables are set
- Check the browser console for errors
- Verify Sanity project ID and dataset name

**Authentication redirect loop:**

- Clear browser cookies for localhost
- Check that `JWT_SECRET` is set and consistent
- Verify the server is running on the correct port

### Getting Help

1. Check the browser console for detailed error messages
2. Verify all environment variables are set correctly
3. Test your Sanity connection with a simple query
4. Ensure your Sanity schema matches the expected structure

## 📝 Schema Requirements

Your Sanity studio should have these document types:

- `galleryImage` - For image uploads
- `galleryVideo` - For video uploads
- `gallery` - For organizing content
- `region` - For location organization

The admin panel expects these fields on each document type as defined in your original schema.

## 🔄 Deployment

### Production Checklist

- [ ] Set secure `JWT_SECRET` (not the example one)
- [ ] Change default admin password
- [ ] Set up proper HTTPS
- [ ] Configure secure cookie settings
- [ ] Set up proper error monitoring
- [ ] Test file upload limits
- [ ] Verify Sanity token permissions

### Environment Variables for Production

Make sure all environment variables are set in your production environment with proper values (not the example ones).

---

Your personal gallery admin panel is now ready! 🎉

For support or questions about your Sanity schema, refer to your original CMS documentation.
