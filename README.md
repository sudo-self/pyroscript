## A react messenger app with Firebase<br>
React 0auth Firebase Tailwind Dicebear APi Vercel<br>
<img id="modeIcon" src="https://bucket.jessejesse.com/fire.webp" alt="Cloudy Icon" class="w-6 h-6 mr-2"><br>
### vercel app: [chat](https://pyroscript.vercel.app/)
### cloudflare worker: [chat](https://chat.jessejesse.workers.dev)
### github pages: [chat](https://sudo-self.github.io/pyroscript/)
### Firebase app: [chat](https://fresh-squeezed-lemons.web.app)
### pages.dev: [chat](https://midnight-messenger.pages.dev/)<br>


### Random Seed

```
      
        function generateRandomSeed() {
            const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let seed = '';
            for (let i = 0; i < 10; i++) {
                seed += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return seed;
        }

```
### confetti (confetti-btn)

```s
     
        var count = 500;
        var defaults = {
            origin: {
                y: 0.7
            }
        };

    function fire(particleRatio, opts) {
            confetti(Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
                colors: ['#D97706']
            }));
        }

        document.addEventListener('DOMContentLoaded', function() {
            var button = document.querySelector('.confetti-btn');
            button.addEventListener('click', function() {
                fire(0.25, {
                    spread: 26,
                    startVelocity: 55,
                });
                fire(0.2, {
                    spread: 60,
                });
                fire(0.35, {
                    spread: 100,
                    decay: 0.91,
                    scalar: 0.8
                });
                fire(0.1, {
                    spread: 120,
                    startVelocity: 25,
                    decay: 0.92,
                    scalar: 1.2
                });
                fire(0.1, {
                    spread: 120,
                    startVelocity: 45,
                });
            });
        });
```

### wrangler.toml

```
name = "chat"
main = "src/index.js"
compatibility_date = "2022-05-06"
site = { bucket = "./public" }
```
### Package.json
```
{
  "name": "chat",
  "version": "0.0.0",
  "devDependencies": {
    "@cloudflare/kv-asset-handler": "^0.2.0",
    "wrangler": "0.0.30"
  },
  "private": true,
  "scripts": {
    "start": "wrangler dev",
    "publish": "wrangler publish"
  }
}
```
### fetch entries on scroll
 
 ```
        window.addEventListener('scroll', () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
                fetchEntries();
            }
        });
 ```

### static.yml

```
name: Deploy static content to Pages

on:
 
  push:
    branches: ["main"]

 
  workflow_dispatch:


permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          # Upload entire repository
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
### Firebase
<img width="738" alt="Screenshot 2024-03-30 at 9 38 20 PM" src="https://github.com/sudo-self/pyroscript/assets/119916323/236b9d29-7b83-4baf-a48b-63521a47f299"><br>

### message count

```
 db.ref("messages").on("value", (snapshot) => {
            const messageCount = snapshot.numChildren();
            document.getElementById("messageCount").textContent = `${messageCount}`;
        });
```
### SDK

```
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

[FIREBASE CONFIG HERE]

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

```



