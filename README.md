# ☕ Perfect Cup

A simple web app to help you brew the perfect cup of coffee. Pick a brewing
method, dial in the recipe, and follow the guided steps with a built-in timer.

## Features

- **Brewing methods** — Pour Over, French Press, Espresso, and AeroPress, each
  with its own grind size, water temperature, and target brew time.
- **Recipe calculator** — choose the number of cups, cup size, and strength to
  get exact water and coffee amounts based on the coffee-to-water ratio.
- **Strength meter** — a row of coffee beans visualises how strong the brew will
  be, from Mild to Strong.
- **Guided steps + timer** — step-by-step brewing instructions with a count-up
  timer that alerts you when the brew is ready.

## Project structure

| File | Purpose |
|------|---------|
| `index.html` | Markup for the app |
| `styles.css` | Styling (warm coffee theme) |
| `app.js` | Brewing presets, calculator, strength meter, and timer logic |
| `server.js` | Minimal Express server used to host the static files |
| `package.json` | Dependencies and the `start` script |
| `infra/main.bicep` | Azure infrastructure (App Service plan + Web App) |
| `infra/main.bicepparam` | Parameter values for the Bicep template |
| `.github/workflows/azure-webapp.yml` | CI/CD: deploys infra and app to Azure |

## Run locally

The app is plain HTML, CSS, and JavaScript. You can run it with either of the
following:

### Using Node (matches production)

```powershell
npm install
npm start
```

Then open <http://localhost:8000>.

### Optional demo fault

The server keeps a demo endpoint at `POST /api/reset` for fault-injection tests,
but it is disabled by default so production traffic does not generate a false
`500` outage signal. Set `ENABLE_DEMO_RESET_FAULT=true` before `npm start` if
you want that endpoint to intentionally return `500` for testing.

### Using Python's built-in server

```powershell
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploy to Azure

Deployment is automated with GitHub Actions. On every push to `main`, the
workflow:

1. Logs in to Azure using OIDC (federated credentials — no stored passwords).
2. Deploys the Bicep infrastructure in `infra/` (App Service plan + Web App).
3. Builds and deploys the app to the Web App.

### Required GitHub secrets

Add these under **Settings → Secrets and variables → Actions**:

| Secret | Description |
|--------|-------------|
| `AZURE_CLIENT_ID` | Application (client) ID of the deployment app registration |
| `AZURE_TENANT_ID` | Azure tenant ID |
| `AZURE_SUBSCRIPTION_ID` | Target Azure subscription ID |

### Manual infrastructure deployment

To deploy the infrastructure by hand:

```powershell
az group create --name perfect-cup-rg --location westeurope
az deployment group create `
  --resource-group perfect-cup-rg `
  --template-file infra/main.bicep `
  --parameters infra/main.bicepparam
```

The Web App name is defined in `infra/main.bicepparam` and must be globally
unique. Keep it in sync with `AZURE_WEBAPP_NAME` in the workflow.

## Customising recipes

Brewing presets live in the `METHODS` object at the top of `app.js`. Each method
defines its icon, grind size, water temperature, target brew time, and steps.
Adjust those values or add a new method to extend the app.
