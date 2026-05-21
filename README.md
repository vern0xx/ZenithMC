# ZenithMC

## 🚀 Szybki Start

### 1. Frontend (lokalnie)
```bash
cd ZenithMC
npm run dev
```

### 2. Konfiguracja zewnętrznych usług

#### Discord OAuth + Bot
1. https://discord.com/developers/applications → **New Application** → "ZenithMC"
2. **General Information** → skopiuj **APPLICATION ID** i **PUBLIC KEY**
3. **Bot** → **Reset Token** → skopiuj **TOKEN**
4. **OAuth2** → **Redirects** → dodaj: `https://vern0xx.github.io/ZenithMC/auth/callback`
5. Wstaw **CLIENT_ID** w `src/config/discord.ts`

#### Microsoft Teams (Azure AD)
1. https://portal.azure.com → **App registrations** → **New registration** → "ZenithMC"
2. Platform: **Single-page application**
3. Redirect URI: `https://vern0xx.github.io/ZenithMC/auth/teams-callback`
4. Skopiuj **Application (client) ID** → wstaw w `src/config/teams.ts`

#### Google Calendar
1. https://console.cloud.google.com → **Create Project**
2. **APIs & Services** → **Library** → włącz **Google Calendar API**
3. **Credentials** → **Create OAuth client ID** → Web application
4. Authorized origins: `https://vern0xx.github.io`
5. Authorized redirect: `https://vern0xx.github.io/ZenithMC/auth/google-callback`
6. Wstaw **CLIENT_ID** w `src/config/google.ts`

#### Firebase Cloud Messaging
1. https://console.firebase.google.com → **Add project**
2. **Add web app** → skopiuj konfigurację
3. Wstaw w `src/config/firebase.ts` ORAZ `public/firebase-messaging-sw.js`
4. **Project Settings** → **Cloud Messaging** → **Generate Web Push certificate** → skopiuj VAPID

#### Twilio (SMS)
1. https://twilio.com → załóż konto
2. Skopiuj **Account SID**, **Auth Token**, **Phone Number**

#### BambooHR
1. **Settings** → **API Keys** → **Add new key**
2. Skopiuj **API Key** i **Subdomain**

### 3. Deploy Worker (Backend)

```bash
cd ZenithMC-worker
npx wrangler login

# Dodaj sekrety
npx wrangler secret put DISCORD_PUBLIC_KEY
npx wrangler secret put DISCORD_BOT_TOKEN
npx wrangler secret put DISCORD_APPLICATION_ID
npx wrangler secret put TWILIO_ACCOUNT_SID
npx wrangler secret put TWILIO_AUTH_TOKEN
npx wrangler secret put TWILIO_PHONE_NUMBER
npx wrangler secret put BAMBOOHR_API_KEY
npx wrangler secret put BAMBOOHR_SUBDOMAIN
npx wrangler secret put ALLOWED_ORIGIN
# Wpisz: https://vern0xx.github.io

# Deploy
npm run deploy

# Zarejestruj komendy Discord
DISCORD_APPLICATION_ID=xxx DISCORD_BOT_TOKEN=xxx npx tsx scripts/register-commands.ts
```

Po deploy w Discord Developer Portal:
- General → **INTERACTIONS ENDPOINT URL**: `https://ZenithMC-worker.vern0xx.workers.dev/discord/interactions`

### 4. Deploy Frontend (GitHub Pages)

```bash
cd ZenithMC
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/vern0xx/ZenithMC.git
git push -u origin main
```

Następnie: **GitHub → Settings → Pages → Source: "GitHub Actions"**

## 🌐 Aplikacja będzie pod:
`https://vern0xx.github.io/ZenithMC/`

## ✅ Funkcje
- 🤖 Discord Bot (/time, /leave, /stats)
- 💬 Microsoft Teams logowanie + webhooks
- 📅 Google Calendar sync
- 📱 SMS przez Twilio
- 🏢 BambooHR + Workday
- 🔔 Push notifications (Firebase)
- 🎨 25 motywów
- 📊 Eksport JSON/CSV
- ⚡ Zapier/Make webhooks
- 🌐 Public API (`window.ZenithAPI`)
