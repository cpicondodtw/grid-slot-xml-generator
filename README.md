# XML Slot Generator

## Environment

Create a local `.env` from `.env.example` and set:

```bash
VITE_SHEET_API_URL=https://script.google.com/macros/s/your-script-id/exec
BASE_PATH=/sfcc-content-slot-generator/
```

For static hosting such as GitHub Pages, use `VITE_SHEET_API_URL` so the app can call the Google Apps Script endpoint directly from the browser.

## Run

```bash
npm run dev
```

## Build and Preview

```bash
npm run build
npm run preview
```

This project deploys correctly to static hosting when `VITE_SHEET_API_URL` is set at build time. If you need to keep the upstream URL private, you must deploy behind a backend or serverless function instead of plain static hosting.
