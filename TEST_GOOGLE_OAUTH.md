# Testing Google OAuth - Step by Step Guide

## ✅ Quick Test Checklist

### Step 1: Check Configuration
Visit this URL in your browser (with your dev server running):
```
http://localhost:3000/api/auth/test-google
```

You should see:
```json
{
  "googleOAuth": {
    "configured": true,
    "hasClientId": true,
    "hasClientSecret": true,
    "clientIdPreview": "123456789-abc...",
    "baseURL": "http://localhost:3000",
    "redirectURI": "http://localhost:3000/api/auth/callback/google"
  },
  "message": "✅ Google OAuth is properly configured!",
  "instructions": "You can test Google sign-in on the /sign-in page"
}
```

### Step 2: Start Your Dev Server
```bash
npm run dev
```

Make sure your server starts without errors. Look for any warnings about missing Google credentials.

### Step 3: Test the Sign-In Page
1. Go to: `http://localhost:3000/sign-in`
2. You should see a "Continue with Google" button
3. Click the button
4. You should be redirected to Google's login page

### Step 4: Complete Google Sign-In
1. Select your Google account
2. Grant permissions (if prompted)
3. You should be redirected back to your app at `http://localhost:3000/`
4. You should now be signed in!

### Step 5: Verify Session
- Check that you're logged in (you should see your dashboard/home page)
- Try refreshing the page - you should stay logged in
- Check browser cookies - you should see a session cookie

## 🔍 Troubleshooting

### If the test endpoint shows "not configured":
- Check your `.env.local` file exists in the project root
- Verify both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
- **Restart your dev server** after adding environment variables
- Make sure there are no extra spaces or quotes around the values

### If you get "redirect_uri_mismatch" error:
- Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- Click on your OAuth 2.0 Client ID
- Make sure `http://localhost:3000/api/auth/callback/google` is in the **Authorized redirect URIs**
- Save and wait 1-2 minutes for changes to propagate

### If the button doesn't redirect:
- Open browser console (F12) and check for errors
- Check the Network tab to see if the API call is failing
- Verify the auth API route is accessible: `http://localhost:3000/api/auth`

### If you see a 404 error:
- Make sure the API route file exists: `app/api/auth/[...all]/route.ts`
- Restart your dev server
- Check that better-auth is installed: `npm list better-auth`

## 🎯 Expected Behavior

✅ **Success Flow:**
1. Click "Continue with Google"
2. Redirect to Google login page
3. Select account and approve
4. Redirect back to your app
5. Automatically signed in
6. Session persists for 30 days

❌ **If something fails:**
- You'll see an error message
- Check the browser console for details
- Check your server logs for errors
- Verify all environment variables are set correctly

## 📝 Quick Command Reference

```bash
# Start dev server
npm run dev

# Check if Google OAuth is configured (with server running)
curl http://localhost:3000/api/auth/test-google

# Or visit in browser:
# http://localhost:3000/api/auth/test-google
```

Good luck testing! 🚀

