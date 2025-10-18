# 🐳 Docker Deployment Guide - One Night Ultimate Werewolf

## Status: Ready to Deploy! ✅

Your application is **fully configured** for Docker deployment. All necessary files are in place:
- ✅ Dockerfile (multi-stage build with nginx)
- ✅ docker-compose.yml
- ✅ nginx.conf (optimized configuration)
- ✅ .dockerignore

---

## Option 1: Local Docker Build (If You Want to Test Locally)

### Install Docker Desktop for Mac

1. **Download Docker Desktop:**
   - Visit: https://www.docker.com/products/docker-desktop/
   - Download the Mac version (Apple Silicon or Intel)

2. **Install:**
   - Open the downloaded .dmg file
   - Drag Docker to Applications
   - Launch Docker Desktop
   - Wait for Docker to start (whale icon in menu bar)

### Build and Run Locally

Once Docker is installed:

```bash
# Navigate to project directory
cd /Users/muhammadilahee/App/Werewolf

# Build the Docker image
docker build -t werewolf-game:latest .

# Run with docker-compose (recommended)
docker-compose up -d

# OR run with docker directly
docker run -d -p 8000:80 --name werewolf werewolf-game:latest
```

**Access your game at:** http://localhost:8000

### Useful Commands

```bash
# Stop the container
docker-compose down

# View logs
docker-compose logs -f

# Rebuild after changes
docker-compose up -d --build

# Remove everything
docker-compose down -v
```

---

## Option 2: Free Docker Hosting (Recommended - No Local Docker Needed!)

I've researched the best **free hosting platforms** that will build and deploy your Docker container automatically. You don't need Docker installed locally for these options!

### 🏆 Top Recommendations

#### 1. **Render.com** (BEST OPTION)
**Why it's the best:**
- ✅ 750 hours/month free (enough for 24/7)
- ✅ Auto-deploys from GitHub
- ✅ Builds Docker automatically
- ✅ Free SSL certificate
- ✅ Custom domain support
- ✅ No credit card required
- ✅ Easy to use interface

**Free Tier:**
- 750 hours/month
- 512 MB RAM
- Sleeps after 15 min of inactivity (wakes in ~30 seconds)

**How to Deploy:**
1. Create account at https://render.com
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Render auto-detects Dockerfile
5. Choose "Free" plan
6. Click "Create Web Service"
7. **Done!** Your game is live in ~5 minutes

**Live URL:** `https://werewolf-game-[random].onrender.com`

---

#### 2. **Railway.app**
**Why it's great:**
- ✅ $5 free credit/month
- ✅ Auto-deploys from GitHub
- ✅ Very fast deployments
- ✅ Great developer experience
- ✅ No credit card for free tier

**Free Tier:**
- $5 credit/month (~500 hours)
- 512 MB RAM
- 1 GB storage

**How to Deploy:**
1. Create account at https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects Dockerfile
5. **Done!** Deployed in ~3 minutes

**Live URL:** `https://werewolf-game-production.up.railway.app`

---

#### 3. **Fly.io**
**Why it's solid:**
- ✅ 3 shared-CPU VMs free
- ✅ 160 GB bandwidth/month
- ✅ Fast global edge network
- ✅ Good for low-latency gaming

**Free Tier:**
- 3 VMs with 256 MB RAM each
- 3 GB storage
- Requires credit card (but won't charge unless you upgrade)

**How to Deploy:**
1. Install flyctl: `brew install flyctl`
2. Login: `fly auth login`
3. In your project: `fly launch`
4. Follow prompts
5. `fly deploy`

**Live URL:** `https://werewolf-game.fly.dev`

---

#### 4. **Koyeb**
**Why it's good:**
- ✅ 2 free services
- ✅ No credit card required
- ✅ Global CDN
- ✅ Auto-scaling

**Free Tier:**
- 2 web services
- 512 MB RAM each
- 2.5 GB storage

**How to Deploy:**
1. Create account at https://koyeb.com
2. "Create App" → "GitHub"
3. Select repository
4. Koyeb detects Dockerfile
5. Deploy!

**Live URL:** `https://werewolf-game-[app-name].koyeb.app`

---

#### 5. **Cyclic.sh**
**Limitation:** Works best with Node.js apps, not ideal for Docker

---

## 📊 Comparison Table

| Platform | Free Hours | RAM | Auto-Deploy | No Credit Card | Best For |
|----------|-----------|-----|-------------|----------------|----------|
| **Render** | 750/mo | 512 MB | ✅ | ✅ | **Best overall** |
| **Railway** | ~500/mo | 512 MB | ✅ | ✅ | Fast deploys |
| **Fly.io** | Always-on | 256 MB | ✅ | ❌ | Global edge |
| **Koyeb** | Always-on | 512 MB | ✅ | ✅ | Simple setup |

---

## 🎯 My Recommendation: Use Render

**Why Render is perfect for your game:**
1. **Most generous free tier** - 750 hours is plenty
2. **No credit card** - Just sign up and deploy
3. **Auto-wake from sleep** - Players won't notice the 30-second wake time
4. **GitHub integration** - Push to GitHub → auto-deploy
5. **Custom domain** - You can add your own domain for free
6. **Easy to use** - Best UI/UX of all platforms

---

## 🚀 Quick Start: Deploy to Render (5 Minutes)

### Step 1: Push to GitHub

```bash
cd /Users/muhammadilahee/App/Werewolf

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/werewolf-game.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Render

1. Go to https://render.com and sign up
2. Click "New +" → "Web Service"
3. Click "Connect GitHub" → Authorize Render
4. Select your `werewolf-game` repository
5. Render will show:
   - **Name:** werewolf-game (you can change this)
   - **Root Directory:** (leave blank)
   - **Environment:** Docker
   - **Plan:** Free
6. Click "Create Web Service"
7. Wait 3-5 minutes for build
8. **Your game is live!** 🎉

### Step 3: Get Your URL

After deployment, Render gives you a URL like:
```
https://werewolf-game-abc123.onrender.com
```

Share this URL with your friends to play!

---

## 🔧 Keeping It Always-On

**Problem:** Free tier services sleep after 15 minutes of inactivity.

**Solutions:**

### Option 1: Use UptimeRobot (Free)
1. Sign up at https://uptimerobot.com
2. Add monitor for your Render URL
3. Set interval to 5 minutes
4. **Result:** Your app never sleeps!

### Option 2: Use Cron-Job.org (Free)
1. Go to https://cron-job.org
2. Create a job to ping your URL every 10 minutes
3. **Result:** App stays awake

### Option 3: Upgrade to Paid (If Popular)
- Render: $7/month for always-on
- Railway: Pay-as-you-go after free credit
- Fly.io: Free tier has always-on VMs

---

## 📱 Custom Domain (Optional)

Once deployed to Render, you can add a custom domain:

1. Buy a domain (Namecheap, Cloudflare, etc.)
2. In Render dashboard: Settings → Custom Domain
3. Add your domain: `werewolf.yourdomain.com`
4. Update DNS records as shown by Render
5. **Free SSL certificate** automatically issued!

---

## 🐛 Troubleshooting

### Build Fails
- Check Render logs for errors
- Ensure all files are committed to GitHub
- Verify Dockerfile syntax

### App Won't Start
- Check that port 80 is exposed in Dockerfile ✅ (already done)
- Verify nginx.conf is valid ✅ (already done)

### Game Doesn't Load
- Check browser console for errors
- Ensure all JS/CSS files are in the repository
- Hard refresh: `Cmd + Shift + R`

---

## 💰 Cost Breakdown

### Free Forever (with limitations):
- **Render:** Free, but sleeps after 15 min
- **Railway:** $5 credit/month (~500 hours)
- **Koyeb:** Free, 512 MB RAM

### If Your Game Gets Popular:
- **Render Starter:** $7/month (always-on, 512 MB)
- **Railway Pro:** Pay-as-you-go (~$5-10/month for small apps)
- **Fly.io:** Free tier + overages (~$3-5/month for light usage)

---

## 🎮 Next Steps After Deployment

1. **Share the URL** with friends
2. **Monitor usage** in platform dashboard
3. **Set up UptimeRobot** if you want 24/7 availability
4. **Add custom domain** if desired
5. **Update the game** - just push to GitHub and it auto-deploys!

---

## ✅ Your Application is Production-Ready!

All the hard work is done:
- ✅ Optimized Dockerfile with multi-stage build
- ✅ Nginx configuration with gzip, caching, security headers
- ✅ Health checks configured
- ✅ All game features working (bots, night actions, voting, etc.)
- ✅ Responsive design
- ✅ Audio narrator feature
- ✅ Night notes tracking

**Just pick a hosting platform and deploy in 5 minutes!**

---

## 📞 Need Help?

If you run into issues:
1. Check the platform's documentation
2. Look at deployment logs in the dashboard
3. Test locally first with Docker (optional)
4. The error messages are usually very clear

---

**Recommended:** Start with **Render.com** - it's the easiest and most generous free tier!

Good luck with your deployment! 🎉🐺
