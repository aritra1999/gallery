# 🚀 Quick Start Guide - Gallery Admin Panel

## 1. Environment Setup

1. **Copy environment file:**

   ```bash
   cp .env.example .env
   ```

2. **Update your `.env` file with these values:**

   ```env
   # Sanity Configuration (already set for your project)
   PUBLIC_SANITY_PROJECT_ID=b74xb8a5
   PUBLIC_SANITY_DATASET=production
   PUBLIC_SANITY_API_VERSION=2024-01-01
   SANITY_TOKEN=your_sanity_write_token_here

   # Generate a secure JWT secret (run the command below)
   JWT_SECRET=your_jwt_secret_here

   # Admin credentials (default password is "test")
   ADMIN_USERNAME=aritra1999
   ADMIN_PASSWORD_HASH=$2b$10$twDrflZ/3RYhgKjuzYJUDOYYEShxyVK4ifA4HQUCB2ABH1KJcjOKy
   ```

## 2. Get Your Sanity Token

1. Go to https://sanity.io/manage
2. Select your project (b74xb8a5)
3. Navigate to **API** → **Tokens**
4. Create a new token with **Write** permissions
5. Copy the token and replace `SANITY_TOKEN` in your `.env` file

## 3. Generate JWT Secret

Run this command to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and replace `JWT_SECRET` in your `.env` file.

## 4. Start the Server

```bash
bun install
bun run dev
```

## 5. Access the Admin Panel

1. Open http://localhost:5173/admin
2. Login with:
   - **Username:** `aritra1999`
   - **Password:** `test`

## 6. Upload Your First Content

1. Click **Upload Content** from the dashboard
2. Select a country and city from the dropdowns
3. Drag & drop or browse for images/videos
4. Click **Upload** to add them to your gallery

## 🔧 Change Password (Recommended)

1. Generate a new password hash:

   ```bash
   bun run generate-hash "your_new_secure_password"
   ```

2. Copy the hash and update `ADMIN_PASSWORD_HASH` in your `.env` file

3. Restart the server

## 📱 Admin Features

- **Dashboard**: Overview of all your content
- **Bulk Upload**: Upload multiple images/videos with location tagging
- **Content Management**: View and organize your gallery items
- **Location-Based Organization**: Searchable countries and cities

## 🆘 Need Help?

Check `ADMIN_SETUP.md` for detailed troubleshooting and advanced configuration.

---

**That's it! Your personal gallery admin panel is ready to use! 🎉**
