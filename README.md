# XML Slot Generator

## Environment

Create a local `.env` from `.env.example` and set:

```bash
SHEET_API_URL=https://script.google.com/macros/s/your-script-id/exec
BASE_PATH=/sfcc-content-slot-generator/
```

`SHEET_API_URL` is server-only. Vite reads it on the server and proxies requests through `/api/sheets`, so the browser no longer receives the raw upstream URL.

## Run

```bash
npm run dev
```

## Build and Preview

```bash
npm run build
npm run preview
```

`npm run preview` keeps the proxy route available. If you deploy this project as plain static files only, secrets cannot be hidden. To keep `SHEET_API_URL` private in production, serve the app behind a server or serverless function that exposes `/api/sheets`.
