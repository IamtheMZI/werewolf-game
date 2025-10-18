# 🌐 Custom Domain Setup - Cloudflare to Render

## Overview

You can use your Cloudflare domain (e.g., `werewolf.yourdomain.com`) instead of the default Render URL!

**Benefits:**
- ✅ Professional branded URL
- ✅ Easy to remember and share
- ✅ Free SSL certificate (automatic)
- ✅ Works on Render free tier

---

## 🎯 Quick Setup (5 Minutes)

### Step 1: Add Custom Domain in Render

**In your Render dashboard:**

1. Go to your **werewolf-game** service
2. Click **"Settings"** tab (left sidebar)
3. Scroll down to **"Custom Domain"** section
4. Click **"+ Add Custom Domain"**
5. Enter your subdomain, for example:
   ```
   werewolf.yourdomain.com
   ```
   (Replace `yourdomain.com` with your actual domain)
6. Click **"Save"**

**Render will show you:**
```
CNAME Record to add:
werewolf.yourdomain.com → werewolf-game-xyz.onrender.com
```

**Copy this information!** You'll need it for Cloudflare.

---

### Step 2: Configure DNS in Cloudflare

**In your Cloudflare dashboard:**

1. Go to https://dash.cloudflare.com
2. Select your domain
3. Click **"DNS"** in the left menu
4. Click **"Add record"**

**Fill in the DNS record:**

| Field | Value |
|-------|-------|
| **Type** | CNAME |
| **Name** | werewolf (or whatever subdomain you want) |
| **Target** | werewolf-game-xyz.onrender.com (from Render) |
| **Proxy status** | 🟠 DNS only (click to toggle) |
| **TTL** | Auto |

**IMPORTANT:** Toggle **"Proxy status"** to **"DNS only"** (gray cloud, not orange)
- Orange cloud = Cloudflare proxy (can cause SSL issues)
- Gray cloud = DNS only (recommended for Render)

5. Click **"Save"**

---

### Step 3: Wait for Propagation (1-10 minutes)

**Back in Render:**
- Render will automatically verify your domain
- Once verified, Render provisions a **free SSL certificate**
- Status changes from "Pending" to "Verified" ✅

**DNS propagation:** 1-10 minutes (usually instant with Cloudflare)

---

### Step 4: Test Your Domain! 🎉

Once verified in Render:

1. Visit: `https://werewolf.yourdomain.com`
2. Your game should load!
3. ✅ Free SSL (https://)
4. ✅ No more Render URL visible

---

## 🔒 SSL Certificate (Automatic)

**Render automatically provides:**
- ✅ Free SSL certificate from Let's Encrypt
- ✅ Auto-renewal every 90 days
- ✅ No configuration needed
- ✅ https:// just works!

---

## ⚙️ Cloudflare Settings (Optional but Recommended)

### Option 1: DNS Only (Recommended for Simplicity)

**Current setup above** - Gray cloud
- Fastest setup
- SSL handled by Render
- No Cloudflare proxy

### Option 2: Cloudflare Proxy (Advanced)

If you want Cloudflare's CDN and DDoS protection:

**In Cloudflare:**
1. Toggle proxy to **Orange cloud** (proxied)
2. Go to **SSL/TLS** → **Overview**
3. Set mode to **"Full (strict)"**
4. Cloudflare will proxy requests to Render
5. Benefit from Cloudflare's CDN

**Note:** Render's SSL certificate works with both options!

---

## 📝 Example Configuration

**If your domain is:** `example.com`

**Subdomain options:**
- `werewolf.example.com` ← Best for game
- `game.example.com`
- `play.example.com`
- `onuw.example.com`

**Cloudflare DNS:**
```
Type:   CNAME
Name:   werewolf
Target: werewolf-game-abc123.onrender.com
Proxy:  DNS only (gray cloud)
```

**Result:**
- Old URL: `https://werewolf-game-abc123.onrender.com`
- New URL: `https://werewolf.example.com` ✨

---

## 🔄 Multiple Subdomains (Optional)

You can add multiple custom domains to the same Render service:

**Examples:**
- `werewolf.example.com` (main)
- `onuw.example.com` (alternative)
- `game.example.com` (alternative)

All point to the same Render deployment!

**In Render:**
- Click "+ Add Custom Domain" for each subdomain
- Follow the same DNS setup in Cloudflare

---

## 🐛 Troubleshooting

### "Domain verification pending"

**Check:**
1. DNS record is correct in Cloudflare
2. CNAME target matches Render's exact URL
3. Proxy status is "DNS only" (gray cloud)
4. Wait 5-10 minutes for propagation

**Verify DNS:**
```bash
# Check if DNS is working
nslookup werewolf.yourdomain.com
# Should show: CNAME -> werewolf-game-xyz.onrender.com
```

### "SSL certificate error"

**Solutions:**
1. If using Cloudflare proxy (orange cloud):
   - Set SSL/TLS mode to "Full (strict)"
2. If using DNS only (gray cloud):
   - Wait for Render to provision certificate (up to 10 min)
   - Render handles SSL automatically

### "Site can't be reached"

**Check:**
1. Render service is deployed and running (green status)
2. DNS record is saved in Cloudflare
3. Try accessing the original Render URL first
4. Wait for DNS propagation (up to 48 hours max, usually instant)

---

## ✅ Verification Steps

**After setup, verify everything works:**

1. **DNS Check:**
   ```bash
   dig werewolf.yourdomain.com
   # Should show CNAME record
   ```

2. **SSL Check:**
   - Visit `https://werewolf.yourdomain.com`
   - Click padlock in browser
   - Certificate should be valid ✅

3. **Game Check:**
   - Load homepage
   - Create game
   - Verify all features work

---

## 🎯 Final Result

**Before:**
```
https://werewolf-game-abc123.onrender.com
```

**After:**
```
https://werewolf.yourdomain.com
```

**Benefits:**
- ✅ Professional branded URL
- ✅ Easy to share with friends
- ✅ Free SSL certificate
- ✅ No "render.com" in URL
- ✅ Looks more professional

---

## 📊 Settings Summary

### Render Settings:
- Service: werewolf-game
- Custom Domain: werewolf.yourdomain.com
- SSL: Automatic (Let's Encrypt)

### Cloudflare Settings:
- Type: CNAME
- Name: werewolf
- Target: [your-render-url].onrender.com
- Proxy: DNS only (gray cloud) ← Recommended
- TTL: Auto

---

## 🚀 Share Your Game!

Once setup is complete, share your custom URL:

```
🐺 Play One Night Ultimate Werewolf!
https://werewolf.yourdomain.com

🎮 Create or join a game
🤖 Add bots to fill lobbies
🌙 Experience the night phase
🗳️ Vote and find the werewolves!
```

Much better than sharing a Render URL! 😎

---

## 💡 Pro Tips

1. **Use a memorable subdomain:**
   - `werewolf.` ✅
   - `play.` ✅
   - `game.` ✅
   - Avoid: `w3r3w0lf-g4m3.` ❌

2. **Keep DNS simple:**
   - Start with "DNS only" (gray cloud)
   - Add Cloudflare proxy later if needed

3. **Test before sharing:**
   - Verify https:// works
   - Test on mobile and desktop
   - Check all game features

4. **Update your README:**
   - Add your custom domain to README.md
   - Update deployment docs

---

**Time to complete:** 5-10 minutes
**Cost:** Free! ✅

Let me know when you've set it up and I can help verify everything works! 🎉
