# 🚀 Deploy Your Werewolf Game NOW!

## ✅ Everything is Ready!

Your code is on GitHub with:
- ✅ Docker configuration
- ✅ Auto-deployment setup (render.yaml)
- ✅ Version control in footer
- ✅ GitHub Actions for build info
- ✅ All features working

**Repository:** https://github.com/IamtheMZI/werewolf-game

---

## 📋 Deploy to Render (2 Minutes)

### Step 1: Go to Render Dashboard

**Click here:** https://dashboard.render.com

(Already opened in your browser!)

---

### Step 2: Create Web Service

1. Click **"New +"** (top right corner)
2. Select **"Web Service"**
3. Click **"Build and deploy from a Git repository"**
4. Click **"Next"**

---

### Step 3: Connect Your Repository

1. Look for: **"IamtheMZI/werewolf-game"**
   - If you don't see it, click "Configure account" and grant access
2. Click **"Connect"** next to it

---

### Step 4: Configure (Auto-Filled!)

Render will auto-detect your `render.yaml` file:

**Verify these settings:**
- ✅ Name: `werewolf-game`
- ✅ Runtime: Docker
- ✅ Branch: `main`
- ✅ Plan: **Free**
- ✅ Region: Oregon (US West)

Everything should be filled in automatically!

---

### Step 5: Deploy!

1. Scroll to the bottom
2. Click **"Create Web Service"**
3. Watch the build logs (live in dashboard)

**Build time:** ~3-5 minutes

---

## 🎉 You'll Get Your Live URL!

After deployment completes, you'll see:

```
https://werewolf-game-[random].onrender.com
```

**This is your live game!** 🎮

---

## ✨ How the Version Control Works

**Version display format:** `1.0.0-a3cfd6b`
- `1.0.0` = Version number
- `a3cfd6b` = Git commit hash (first 7 chars)

**Where it appears:**
- ✅ Index page footer
- ✅ Lobby page footer
- ✅ Game page footer (bottom right)

**How it updates:**
1. You push code to GitHub
2. Docker build generates version.js from git commit
3. Footer shows current deployed version
4. **No manual work!**

---

## 🔄 Future Updates

**To update your game:**

```bash
# 1. Make changes to your code
# 2. Commit and push
git add .
git commit -m "feat: add new feature"
git push

# 3. Render auto-deploys in ~2 minutes
# 4. Version automatically updates!
```

**That's it!** No manual deployment needed.

---

## 🌐 After Deployment

**Test your live game:**

1. Visit your Render URL
2. Create a game
3. Add some bots
4. Start and play through
5. Check footer - you'll see: `v1.0.0-a3cfd6b`!

---

## ⚡ Keep It Always-On (Optional)

Free tier sleeps after 15 min of inactivity.

**Solution: UptimeRobot (Free)**

1. Go to: https://uptimerobot.com
2. Sign up (free)
3. Add monitor:
   - Type: HTTP(s)
   - URL: Your Render URL
   - Interval: 5 minutes
4. **Result:** 24/7 uptime!

---

## 📊 What You've Built

✅ **Full multiplayer Werewolf game**
- 9 roles with AI bots
- Audio narrator
- Night notes
- Auto-advancing gameplay
- Beautiful responsive UI

✅ **Professional deployment**
- Docker containerized
- Auto-deploy from GitHub
- Automatic version control
- Production-ready nginx config
- Health checks
- Security headers

✅ **Zero-cost hosting**
- Free Render tier
- No credit card required
- 750 hours/month free
- Free SSL certificate

---

## 🎯 Current Status

**GitHub Repository:**
✅ https://github.com/IamtheMZI/werewolf-game

**Latest Commit:**
✅ `a3cfd6b` - Version generation fix

**Next Step:**
👉 **Deploy to Render** (2 minutes!)

---

## 🆘 Need Help?

**If deployment fails:**
- Check build logs in Render dashboard
- Ensure Dockerfile builds correctly
- Verify render.yaml syntax

**Common issues:**
- "Repository not found" → Grant Render access to your GitHub repos
- "Build failed" → Check Dockerfile in logs
- "Service unavailable" → Wait for deployment to complete

---

**You're ONE STEP away from having your game live on the internet!**

👉 **Go to Render dashboard and click "New +" now!**

🔗 https://dashboard.render.com
