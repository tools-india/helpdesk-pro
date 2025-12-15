# Deploying Node.js App on Cloudways

Cloudways is excellent for hosting PHP/WordPress sites, but it **does not support Node.js natively** in the same way Render or Heroku does. It is primarily a managed ecosystem for PHP.

However, you **CAN** host Node.js applications on Cloudways by creating a custom PHP application and using it as a reverse proxy, but this is **complex** and **not recommended for beginners** because:
1.  You have to manually install Node.js via SSH.
2.  You have to use PM2 to keep the server running.
3.  You have to edit Apache/Nginx configuration files to map the port.
4.  Updates and maintenance are manual.

## Recommended Alternative for Node.js
If you want professional, scalable Node.js hosting (like Cloudways is for PHP), consider:
1.  **Railway.app** (Very easy, similar to Render but often more stable)
2.  **DigitalOcean App Platform** (Cloudways is built on DigitalOcean, but this is their direct PaaS for Node)
3.  **Heroku** (The standard for Node.js)
4.  **Render** (Where you are now)

---

## If You MUST Use Cloudways (Advanced Guide)

If you already have a server and want to save money, follow these steps strictly.

### 1. Create a Custom Application
1.  Log in to Cloudways.
2.  Go to **Servers** -> Select your Server.
3.  Click **"Add App"**.
4.  Select Application Type: **Custom PHP**.
5.  Name it `Helpdesk` and select your server.

### 2. Enable SSH Access
1.  Go to **Master Credentials** on your Server page.
2.  Copy your **IP**, **Username**, and **Password**.
3.  Open your stored terminal/command prompt and SSH into the server:
    ```bash
    ssh username@server_ip_address
    ```
    (Enter password when prompted. You won't see typing.)

### 3. Install Node.js on Server
By default, the Node version might be old. Install a newer one:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v   # Verify version (should be v18+)
```

### 4. Deploy Your Code
You can clone your git repo directly on the server.
1.  Navigate to your app's folder:
    ```bash
    cd applications/your_app_folder_name/public_html
    ```
    (You can find `your_app_folder_name` in Cloudways Application Settings -> DB Name usually matches folder name).

2.  Clone your repo (Empty the directory first if needed):
    ```bash
    rm -rf *
    git clone https://github.com/tools-india/helpdesk-pro.git .
    ```

3.  Install Dependencies:
    ```bash
    npm install
    ```

4.  Create .env file:
    ```bash
    nano .env
    ```
    (Paste your `.env` content here. Right-click to paste. `Ctrl+X`, then `Y`, then `Enter` to save).

### 5. Start the Application with PM2
PM2 ensures your app keeps running even if the server restarts.
```bash
sudo npm install pm2 -g
pm2 start backend/server.js --name "helpdesk"
pm2 save
pm2 startup
```

### 6. Map the Port (Crucial Step)
Your app runs on port `3000` (or what you set), but the web is looking at port `80`. You need to tell the server to forward traffic.
1.  In Cloudways via SSH, verify the port your app is using (e.g., 3000).
2.  You need to modify the **Nginx** configuration or `.htaccess` (if using Apache) to reverse proxy.
    *   **This is the hardest part on Cloudways** because they overwrite configurations.
    *   Normally, you create a custom `.conf` file in the Nginx includes folder if you have root access.

**Simpler Cloudways Trick (.htaccess):**
Create a `.htaccess` file in `public_html`:
```apache
RewriteEngine On
RewriteRule ^$ http://127.0.0.1:3000/ [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
```
*Note: This usually requires specific Apache modules enabled by Cloudways support.*

### PRO TIP: Use a VPS directly instead
If you are comfortable with this complexity, it is far cheaper and better to get a **$5 Droplet on DigitalOcean** or **Hetzner** and use **Coolify.io** (which is a free, self-hosted Cloudways alternative for Node.js).

### Summary
Cloudways is **not optimized** for Node.js. It is a PHP powerhouse. Using it for this MERN stack app will be a headache compared to Render/Railway. Stick to Render if possible for this project.
