
<h1 align="center">✨ RoshanCode</h1>
<h3 align="center"><i>Bring your code to light.</i></h3>

<p align="center">
  A sleek, zero-dependency HTML/CSS/JS playground that renders your code in real-time. 
  <br>No Node.js. No npm install. No build step. Just pure, instant creation.
</p>

<div align="center">
  <img src="https://img.shields.io/badge/Status-Stable-7CE7B8?style=for-the-badge&logo=github" alt="Status">
  <img src="https://img.shields.io/badge/Version-1.0.0-7CE7B8?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-7CE7B8?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/No_Build_Step-✓-7CE7B8?style=for-the-badge" alt="No Build Step">
  <img src="https://img.shields.io/badge/Made_in-Pakistan-7CE7B8?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA0MCI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMDE0MjJhIi8+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTgsMTIpIi8+PHBhdGggZD0iTTI2LDIwYzAsNS41LTQuNSwxMC0xMCwxMHMtMTAtNC41LTEwLTEwIDQuNS0xMCAxMC0xMCAxMCA0LjUgMTAgMTB6IiBmaWxsPSIjMDE0MjJhIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxOCwxMikiLz48cGF0aCBkPSJNMjgsMThjMCw0LjQtMy42LDgtOCw4cy04LTMuNi04LThoMTZ6IiBmaWxsPSJ3aGl0ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTgsMTIpIi8+PC9zdmc+" alt="Made in Pakistan">
</div>


---

## 🌟 The Future of Browser-Based Coding

**RoshanCode** is built for developers who want to experiment, learn, and prototype without the bloat of modern toolchains. Think W3Schools, but reimagined with a futuristic UI, offline-first storage, and a live console—all running entirely in your browser.

### 🚀 Key Features

- ⚡ **Live Auto-Render** – See your HTML/CSS/JS update instantly as you type (with a toggleable Auto-run).
- 📱 **Device Preview** – Switch between Desktop, Tablet, and Mobile viewports instantly.
- 💾 **Local Projects** – Save, Load, and Delete projects directly in your browser's `localStorage` (no server needed).
- 🔗 **Shareable Links** – Encode your entire project into a URL and share it with anyone.
- 📥 **One-Click Download** – Export your creation as a standalone `.html` file.
- 🖥️ **Built-in Console** – Capture `console.log`, errors, and warnings directly inside the app.
- 🔌 **Zero Dependencies** – No build tools, no package managers—just open `index.html` and go.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Core** | Vanilla HTML5, CSS3, ES Modules |
| **Editor** | CodeMirror 6 (syntax highlighting, auto-indent) |
| **Fonts** | Space Grotesk, Inter, JetBrains Mono |
| **Storage** | Browser `localStorage` API |
| **Preview** | Sandboxed `<iframe>` with console bridging |
| **CDN** | esm.sh (for CodeMirror ESM imports) |

---

## 🏃‍♂️ Run It Locally

### Easiest Way (No Setup)
Double-click `index.html` and it opens in your browser. Done.

### If your browser blocks it (CORS restrictions)
Serve the folder using any of these:

```bash
# Python 3 (most systems already have this)
python3 -m http.server 8000

# Node.js (if you have it)
npx serve .

# VS Code (if you use it)
# Install "Live Server" extension → Right-click index.html → Open with Live Server
```

Then visit `http://localhost:8000`.

---

## ☁️ Deploy to GitHub Pages (Free)

1. Fork or clone this repo.
2. Go to your repo **Settings → Pages**.
3. Set **Source** to `Deploy from a branch` → `main` → `/ (root)`.
4. Click **Save**.
5. In ~1 minute, your instance is live at:  
   `https://[your-username].github.io/roshancode/`

---

## 🎮 How to Use RoshanCode

| Action | How-to |
| :--- | :--- |
| **Run Code** | Click the **Run** button or press `Ctrl/Cmd + Enter` |
| **Toggle Auto-run** | Check/uncheck the **Auto-run** box beside the Run button |
| **Switch Device View** | Click the **Desktop/Tablet/Mobile** icons in the top bar |
| **Save Project** | Click the **Floppy Disk (Save)** icon, name it, and save |
| **Load Projects** | Click the **Folder (Projects)** icon to browse and load |
| **Share** | Click the **Nodes (Share)** icon to copy a link with your code |
| **Download** | Click the **Download** icon to save a standalone HTML file |
| **Reset** | Click the **Reset** button to restore the starter template |

---

## 🔐 Security

Since RoshanCode is a **100% static, client-side application**, it has zero external attack surfaces. No data is ever sent to a server. All code and projects remain strictly in your browser's `localStorage`.

For more details, see the [SECURITY.md](SECURITY.md) file.

---

## 🧑‍💻 Contributing

We welcome contributions that make RoshanCode faster, more accessible, or more feature-rich!

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📜 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

<div align="center">
  <sub>Built with 💚 by Umair Ali Bhutto.</sub>
  <br>
  <sub>⭐ Star this repo if you find it useful!</sub>
</div>


