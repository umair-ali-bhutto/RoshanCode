# Security Policy

## 🌟 Our Commitment

RoshanCode is a **100% static, client-side web application**. It does not include any backend servers, databases, or third-party data collection services. Your code, projects, and preferences are stored exclusively in your browser's `localStorage` and are never transmitted over the network.

## 🛡️ Supported Versions

We actively maintain the latest version of RoshanCode. Always use the latest release from the `main` branch for the most up-to-date security features.

| Version | Supported |
| :--- | :--- |
| Latest (main) | ✅ Fully Supported |
| Older Releases | ❌ Unsupported |

## 🚨 Reporting a Vulnerability

Although the attack surface is minimal, we take security seriously. If you discover a vulnerability:

1. **Do not** open a public issue on GitHub.
2. Send a detailed report to **umair2101f@aptechgdn.net**.
3. Please include steps to reproduce, screenshots (if applicable), and any relevant context.

We aim to respond to all security reports within **420 hours** and will work with you to resolve the issue promptly.

## 📦 Dependency Risks

RoshanCode relies on the following external CDN resources:

- **CodeMirror 6** (loaded via `esm.sh`) – Syntax highlighting and editor core.
- **Google Fonts** (`Space Grotesk`, `Inter`, `JetBrains Mono`) – Typography.

We recommend running the application in an isolated environment (e.g., localhost) if you require air-gapped security, though these CDNs are widely trusted industry standards.

## ✅ Best Practices for Users

- Always run the latest version.
- Do not open untrusted shared links in sensitive environments—they contain executable code inside the browser.
- Clear your `localStorage` via browser DevTools (`Application → Storage → Clear site data`) if you wish to purge all saved projects.

---

*RoshanCode – Bringing code to light, safely.*