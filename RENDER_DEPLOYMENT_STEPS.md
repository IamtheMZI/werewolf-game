# 🚀 Render Deployment - Step by Step

## Your GitHub Repository
✅ **Repository:** https://github.com/IamtheMZI/werewolf-game
✅ **All 44 files pushed successfully**
✅ **Docker configuration ready**

---

## Step-by-Step Deployment to Render

### Step 1: Sign Up for Render

1. **Open Render:** https://dashboard.render.com/register

2. **Sign up with GitHub:**
   - Click **"Sign up with GitHub"** (green button)
   - Authorize Render to access your GitHub account
   - This connects your GitHub repos to Render

---

### Step 2: Create a New Web Service

1. **Click "New +"** in the top right corner

2. **Select "Web Service"**

3. **Click "Build and deploy from a Git repository"**

4. **Click "Next"**

---

### Step 3: Connect Your Repository

1. **Find your repository:**
   - Look for: **"IamtheMZI/werewolf-game"**
   - If you don't see it, click "Configure account" to grant access

2. **Click "Connect"** next to werewolf-game

---

### Step 4: Configure the Service

Fill in these settings:

**Basic Settings:**
- **Name:** `werewolf-game` (or anything you like)
  - This will be part of your URL: `werewolf-game.onrender.com`
- **Region:** `Oregon (US West)` (or choose closest to you)
- **Branch:** `main` ✓
- **Root Directory:** (leave blank)

**Build & Deploy:**
- **Runtime:** Should auto-detect as **"Docker"** ✓
- **Dockerfile Path:** `Dockerfile` (should be automatic)

**Instance Type:**
- **Select:** **"Free"** ✓
  - 512 MB RAM
  - Sleeps after 15 min of inactivity
  - $0/month

**Advanced (optional - can skip):**
- Auto-Deploy: ✓ Yes (deploys automatically when you push to GitHub)

---

### Step 5: Deploy!

1. **Scroll to bottom**

2. **Click "Create Web Service"**

3. **Wait for deployment** (3-5 minutes)
   - You'll see build logs in real-time
   - Watch for:
     ```
     Building Docker image...
     Pushing image...
     Starting service...
     ✅ Deploy successful!
     ```

---

### Step 6: Get Your Live URL

Once deployed, you'll see:

```
https://werewolf-game-[random-id].onrender.com
```

**This is your live game URL!** 🎉

---

## Testing Your Deployment

### Test Checklist:

1. **Visit your URL** - Homepage should load
2. **Create a game** - Click "Host New Game"
3. **Add bots** - Click "Add Bot" a few times
4. **Start game** - Click "Start Game"
5. **Play through** - Test night actions, discussion, voting
6. **Check results** - Verify winner detection works

---

## Common Issues & Solutions

### Issue 1: "Build Failed"
**Check:**
- Build logs for specific error
- Dockerfile exists in repository ✓ (we have it)
- docker-compose.yml is valid ✓ (we have it)

**Solution:** Usually automatic, Render detects Docker correctly

---

### Issue 2: "Service Unavailable"
**Cause:** Service is sleeping (free tier)

**Solution:**
- Just visit the URL again
- It will wake up in 30 seconds
- To keep it always-on, use UptimeRobot (see below)

---

### Issue 3: "Page Not Loading"
**Check:**
- Deployment status is "Live" (green)
- No errors in logs
- Try hard refresh: `Cmd + Shift + R`

---

## Keep Your Game Always-On (Optional)

Free tier services sleep after 15 minutes. To prevent this:

### Use UptimeRobot (Free):

1. **Sign up:** https://uptimerobot.com
2. **Add New Monitor:**
   - Monitor Type: HTTP(s)
   - Friendly Name: Werewolf Game
   - URL: Your Render URL
   - Monitoring Interval: 5 minutes
3. **Save**

**Result:** Your game will be pinged every 5 minutes and stay awake 24/7!

---

## Updating Your Game

To deploy updates:

1. **Make changes locally**
2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Update: description of changes"
   git push
   ```
3. **Render auto-deploys** in ~2 minutes
4. **Your live site updates automatically!**

---

## Custom Domain (Optional)

Want `werewolf.yourdomain.com` instead of the Render URL?

1. **Buy a domain** (Namecheap, Cloudflare, etc.)
2. **In Render dashboard:**
   - Go to your service
   - Click "Settings"
   - Scroll to "Custom Domain"
   - Add your domain
3. **Update DNS records** as shown by Render
4. **Free SSL certificate** issued automatically!

---

## Monitoring & Logs

**View logs:**
- Dashboard → Your Service → "Logs" tab
- See real-time requests and errors

**Check metrics:**
- Dashboard → Your Service → "Metrics" tab
- See CPU, memory, request count

**Service status:**
- Green = Live
- Yellow = Deploying
- Red = Error

---

## Costs

**Free Tier:**
- ✅ 750 hours/month
- ✅ 512 MB RAM
- ✅ Free SSL
- ✅ Auto-deploy from GitHub
- ⚠️ Sleeps after 15 min

**Upgrade to Starter ($7/month):**
- Always-on (no sleep)
- 512 MB RAM
- Free SSL
- Worth it if game gets popular!

---

## URLs Summary

**Your Repository:**
https://github.com/IamtheMZI/werewolf-game

**Render Dashboard:**
https://dashboard.render.com

**Your Live Game:**
(Will be shown after deployment)
`https://werewolf-game-[id].onrender.com`

---

## Next Steps After Deployment

1. ✅ Visit your live URL
2. ✅ Test the game thoroughly
3. ✅ Share URL with friends
4. ✅ Set up UptimeRobot for 24/7 uptime
5. ✅ Play and enjoy! 🎮

---

## Need Help?

- **Render Docs:** https://render.com/docs
- **Render Community:** https://community.render.com
- **Your build logs:** Check Render dashboard for detailed error messages

---

**You're moments away from having your game live on the internet!** 🚀

Just follow the steps above and you'll be playing in 5 minutes!
