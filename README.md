# Wealth OS

Private personal finance web app built for William. React 19 + TypeScript + Tailwind CSS 4, official coss UI components on Base UI, Vinext / Cloudflare Workers, and Cloudflare D1.

## Features

- Dashboard: net worth, monthly income and cash surplus, emergency runway, six-month cashflow, and goal progress.
- Accounts: cash, investments, other assets, liabilities; opening balances with dates.
- Transactions: income, expense, asset transfer, borrowing, principal repayment, and valuation changes. Create, edit, delete, search, period filtering, CSV export.
- Income streams: monthly target, actual income, attributed expenses and net cash income.
- Goals: IDR or USD, independent deadlines, priorities, monthly requirements, cash envelopes and net-worth goals. A birthdate can create a $1 million before age 25 target.
- Reports: cash-basis income/expense statement, balance sheet, cashflow reconciliation, CSV downloads.
- Investment lab: future value, monthly contribution needed, time to target, real purchasing power, return sensitivity.
- Private cloud persistence, version checks against conflicting edits, JSON backup and validated restore.
- Responsive layout and PWA manifest/icons/service worker. Financial records are not cached offline.

## First use

1. Sign in with the same ChatGPT account that owns the private Site.
2. Add account opening balances, dated before any transactions you enter.
3. Edit profile: birthdate, income target, expense budget, USD/IDR assumption, return and inflation assumptions.
4. Add your businesses, then record income/expenses linked to them.
5. Allocate cash to goals. These are transfers into separate cash envelopes, not expenses or extra assets.
6. Back up periodically from Settings.

## Accounting rules

Money is recorded in IDR. USD goals use the manually configured exchange rate. No live market-price, bank, brokerage or exchange-rate integration is included.

Net worth = asset balances - liabilities. Opening balances are equity, not income. Buying an investment or other asset is a transfer. Borrowing increases cash and debt together; repaying principal reduces both. Interest paid is an expense. Valuation changes affect assets/equity but do not appear as operating cash surplus. To sell an investment, first adjust its value to the sale value, then transfer to cash. Do not double-count business revenue and the owner's withdrawal.

Reports use cash basis, not accrual business accounting. Taxes and depreciation are not automatic. Opening cash accounts added during a reporting period appear separately in cashflow reconciliation. Only dated records at or before a reporting date enter its balance sheet.

Goal deposits are at month end strictly before the deadline. 1 November 2026 to 1 July 2027 gives 8 deposits. Initial goals total Rp217,500,000, needing Rp27,187,500 per month from zero, plus the living-expense budget. Short-term goals do not assume investment returns. Cash envelopes each belong to one goal. A net-worth goal can overlap savings goals and is excluded from the combined savings contribution requirement.

Investment calculations use an effective annual return converted to a monthly rate and end-of-month contributions. Horizon is limited to 100 years. Initial values of 8% return, 3% inflation and IDR16,000/USD are editable illustrations, not forecasts. Reference: https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator and https://www.investor.gov/introduction-investing.

## Phone installation

Open the deployed HTTPS URL in Safari (iPhone) or Chrome (Android), sign in, then Share > Add to Home Screen (iPhone) or menu > Install app/Add to Home screen (Android). Internet is required for finance records. Offline navigation shows an offline page without storing a copy of financial data in the service worker cache.

## Development

Node >=22.13.0. Dependencies are pinned in package-lock.json.

```sh
npm run install:ci
npm run dev
node node_modules/typescript/bin/tsc --noEmit
node --test tests/finance.test.mjs
npm run build
```

On this Windows installation, npm's command shim misresolves its path when invoked by the Sites helper. A direct equivalent works:

```powershell
node 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js' run build
```

Local preview uses the starter's loopback-only mock login; production uses Sites authentication. The app's API rejects absent identity and stores each user's state under their Site-specific user ID. GET responses are no-store. PUT validates financial invariants and checks the persisted revision atomically. Concurrent edits return HTTP409 and require a refresh. The client only confirms a save after the server succeeds.

Database migrations: generate with `npm run db:generate`; build; apply each pending SQL once using:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_heavy_obadiah_stane.sql
```

Local and hosted databases are separate. Never replay applied migrations. Sites deploys hosted schema migrations. Runtime data, local test snapshots, caches and dependencies are ignored by Git. Limits: 200 accounts, 100 goals, 100 streams, 10,000 transactions; backup/request validation applies a size limit.

## Verification

- TypeScript check and production build passed.
- Eight financial-domain tests cover compound math, zero-return and unreachable scenarios, deadline counting, ledger reconciliation, invalid references and negative balances, goal funding and exchange-rate assumptions.
- Local browser: create account, income, expense, fund a goal, cashflow with zero reconciliation difference, persist across reload/restart, live calculator, download backup, installation guide.
- Local HTTP smoke checks: anonymous 401, no-store, cross-origin rejection, invalid data400, stale revision409, business/investment/valuation persistence and snapshot restoration.
- Phone viewport 390px: navigation, calculator and responsive layout checked. Actual installation on a physical phone is not automated.

The Site ID and bindings live in .openai/hosting.json. Use the Sites workflow for source synchronization and private publication. Preserve owner-only access.
