# Deploying to Railway.app (Better than Render)

Railway is faster and doesn't have the "Sleeping" issue on paid plans (and gives $5 free trial credit which lasts months for small apps).

### Step 1: Login to Railway
1.  Go to [Railway.app](https://railway.app/).
2.  Click **"Login"** -> Select **"GitHub"**.
3.  Authorize Railway to access your GitHub account.

### Step 2: Create New Project
1.  Click **"+ New Project"** (Big button).
2.  Select **"Deploy from GitHub repo"**.
3.  Search/Select your repo: **`helpdesk-pro`** (or whatever you named it).
4.  Click **"Deploy Now"**.

### Step 3: Configure Environment Variables
*(This is crucial. The app will fail initially without these.)*

1.  Once the project page opens, click on the **"Variables"** tab.
2.  Click **"New Variable"**.
3.  Add all variables from your local `.env` file:
    *   `MONGODB_URI`: (Paste your MongoDB Connection String)
    *   `JWT_SECRET`: (Paste your secret)
    *   `PORT`: `8080` (Railway uses its own port, but setting this is good practice. Railway automatically injects a `PORT` variable, so your code `process.env.PORT` will pick it up correctly.)
    *   `NODE_ENV`: `production`

### Step 4: Generate Domain (Public URL)
*(By default, Railway doesn't give a public link immediately.)*

1.  Go to the **"Settings"** tab of your service.
2.  Scroll down to **"Networking"**.
3.  Click **"Generate Domain"**.
4.  It will create a link like `helpdesk-pro-production.up.railway.app`.

### Step 5: Update MongoDB IP Access (Important!)
Since Railway IPs change, you **MUST** have `0.0.0.0/0` (Allow Anywhere) in MongoDB Atlas Network Access. (You already did this for Render, so you are GOOD to go! ✅).

### Step 6: Verify Deployment
1.  Click the **"Deployments"** tab.
2.  You should see the latest commit building.
3.  Once it says "Active", click your generated domain URL.
4.  The app should load instantly without the "Starting..." screen.

---
**Why Railway?**
- No "Cold start" (sleeping).
- Faster build times.
- Better logs.
