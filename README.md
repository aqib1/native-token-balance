# Native Token Balance Display

A React + TypeScript project that displays a wallet address with its native token balance, such as ETH, MATIC, or BNB.

The project supports two modes:

1. **Demo Balance Mode**
   - Fetches the real on-chain native balance of a public demo wallet address.
   - Does not require connecting a personal wallet.
   - Safe for demos, assignments, and Loom recordings.

2. **Actual Wallet Mode**
   - Allows a reviewer or user to connect their own browser wallet, such as MetaMask.
   - Displays the connected wallet address, network, and native token balance.

---

## Project Purpose

The purpose of this task is to show a user's native token balance next to their wallet address.

This is useful because users can quickly check whether they have enough native tokens available for gas fees.

Example:

```txt
0xd8dA...6045 • 1.2345 ETH
```

The implementation demonstrates:

- `wagmi` hooks
- Native token balance fetching
- Multi-chain support
- Balance formatting to 4 decimal places
- Safe demo mode using a public read-only wallet address
- Optional actual wallet connection for reviewers

---

## Tech Stack

- React
- TypeScript
- Vite
- wagmi
- viem
- TanStack React Query
- CSS

---

## Supported Networks

| Network | Chain ID | Native Token |
|---|---:|---|
| Ethereum Mainnet | 1 | ETH |
| Sepolia Testnet | 11155111 | ETH |
| Polygon | 137 | MATIC |
| BNB Chain | 56 | BNB |

---

## Features

### Demo Balance Mode

Demo Balance Mode fetches the real on-chain native balance of a public wallet address.

This mode does **not** require:

- A personal wallet
- A private key
- A seed phrase
- MetaMask connection
- Real user funds

This is the recommended mode for assignment review and Loom demonstration.

### Actual Wallet Mode

Actual Wallet Mode allows a reviewer to connect their own browser wallet.

After connection, the app displays:

- Shortened wallet address
- Connected network
- Native token balance
- Native token symbol

The app never asks for private keys or seed phrases.

---

## Project Structure

```txt
native-token-balance-display
├── public
├── src
│   ├── components
│   │   ├── ActualWalletBalance.tsx
│   │   └── DemoBalance.tsx
│   ├── utils
│   │   ├── formatAddress.ts
│   │   └── formatBalance.ts
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── wagmiConfig.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Prerequisites

Make sure the following tools are installed.

### Node.js

Recommended version:

```bash
node -v
```

Expected:

```bash
v20.19.4
```

If using `nvm`, install and use the required Node version:

```bash
nvm install 20.19.4
nvm use 20.19.4
```

### npm

Check npm version:

```bash
npm -v
```

### VS Code

Open the project in VS Code:

```bash
code .
```

---

## Setup Instructions

### 1. Open the project

```bash
cd native-token-balance-display
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The app will usually run at:

```txt
http://localhost:5173
```

Open the URL in your browser.

---

## Available Commands

### Start development server

```bash
npm run dev
```

Runs the app locally in development mode.

### Build project

```bash
npm run build
```

Creates a production-ready build.

### Preview production build

```bash
npm run preview
```

Runs the production build locally.

### Run linting

```bash
npm run lint
```

Checks the project for linting issues.

---

## Installation From Scratch

If creating the project from zero, use these commands:

```bash
npm create vite@latest native-token-balance-display -- --template react-ts
cd native-token-balance-display
npm install
npm install wagmi viem @tanstack/react-query
npm run dev
```

---

## Core Files

### `src/wagmiConfig.ts`

This file configures supported chains, RPC transports, and wallet connectors.

```ts
import { createConfig, http } from "wagmi";
import { bsc, mainnet, polygon, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [mainnet, polygon, bsc, sepolia],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [mainnet.id]: http("https://ethereum-rpc.publicnode.com"),
    [polygon.id]: http("https://polygon-bor-rpc.publicnode.com"),
    [bsc.id]: http("https://bsc-rpc.publicnode.com"),
    [sepolia.id]: http("https://ethereum-sepolia-rpc.publicnode.com"),
  },
});
```

---

### `src/main.tsx`

This file wraps the React app with `WagmiProvider` and `QueryClientProvider`.

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { wagmiConfig } from "./wagmiConfig";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
```

---

### `src/utils/formatAddress.ts`

Formats long wallet addresses into a readable short form.

```ts
export function formatAddress(address?: string): string {
  if (!address) return "";

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
```

Example:

```txt
0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
```

becomes:

```txt
0xd8dA...6045
```

---

### `src/utils/formatBalance.ts`

Formats a token balance to 4 decimal places.

```ts
export function formatBalance(value?: string, decimals = 4): string {
  if (!value) return "0.0000";

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "0.0000";
  }

  return numericValue.toFixed(decimals);
}
```

Example:

```txt
1.23456789
```

becomes:

```txt
1.2346
```

---

### `src/components/DemoBalance.tsx`

This component fetches the real on-chain native token balance of a public demo address.

```tsx
import { useBalance } from "wagmi";
import { mainnet, polygon, bsc, sepolia } from "wagmi/chains";
import { formatAddress } from "../utils/formatAddress";
import { formatBalance } from "../utils/formatBalance";

const demoAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

const supportedChains = [
  {
    id: sepolia.id,
    name: "Sepolia Testnet",
  },
  {
    id: mainnet.id,
    name: "Ethereum",
  },
  {
    id: polygon.id,
    name: "Polygon",
  },
  {
    id: bsc.id,
    name: "BNB Chain",
  },
];

type DemoBalanceProps = {
  selectedChainId: number;
  onChainChange: (chainId: number) => void;
};

export function DemoBalance({
  selectedChainId,
  onChainChange,
}: DemoBalanceProps) {
  const {
    data: balance,
    isLoading,
    isError,
    error,
    refetch,
  } = useBalance({
    address: demoAddress,
    chainId: selectedChainId,
    query: {
      enabled: Boolean(selectedChainId),
      refetchInterval: 10_000,
      retry: 2,
    },
  });

  return (
    <div className="wallet-card">
      <h2>Demo Balance</h2>

      <p>
        This mode fetches the real on-chain native balance of a public demo
        address. No personal wallet is required or exposed.
      </p>

      <label className="select-label" htmlFor="chain-select">
        Select Network
      </label>

      <select
        id="chain-select"
        className="chain-select"
        value={selectedChainId}
        onChange={(event) => onChainChange(Number(event.target.value))}
      >
        {supportedChains.map((chain) => (
          <option key={chain.id} value={chain.id}>
            {chain.name}
          </option>
        ))}
      </select>

      <div className="wallet-row">
        <span className="label">Wallet Address</span>
        <span className="value">{formatAddress(demoAddress)}</span>
      </div>

      <div className="wallet-row">
        <span className="label">Native Balance</span>

        <span className="value">
          {isLoading && "Loading..."}

          {isError && "Balance unavailable"}

          {!isLoading && !isError && balance && (
            <>
              {formatBalance(balance.formatted)} {balance.symbol}
            </>
          )}
        </span>
      </div>

      {isError && (
        <>
          <p className="error-message">
            {error?.message ?? "Unable to fetch balance from RPC."}
          </p>

          <button
            className="secondary-button"
            type="button"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </>
      )}
    </div>
  );
}
```

---

### `src/components/ActualWalletBalance.tsx`

This component allows a reviewer to connect their own wallet and view their real native token balance.

```tsx
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
import { formatAddress } from "../utils/formatAddress";
import { formatBalance } from "../utils/formatBalance";

export function ActualWalletBalance() {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const {
    data: balance,
    isLoading,
    isError,
  } = useBalance({
    address,
    chainId: chain?.id,
    query: {
      enabled: Boolean(address && chain?.id),
      refetchInterval: 10_000,
    },
  });

  const firstConnector = connectors[0];

  const handleConnect = () => {
    if (!firstConnector) {
      alert("No wallet provider found. Please install MetaMask.");
      return;
    }

    connect({ connector: firstConnector });
  };

  if (!isConnected || !address) {
    return (
      <div className="wallet-card">
        <h2>Actual Wallet</h2>

        <p>
          Connect a browser wallet such as MetaMask. This is optional and can be
          used by the reviewer with their own account.
        </p>

        <button
          className="primary-button"
          type="button"
          disabled={isPending}
          onClick={handleConnect}
        >
          {isPending ? "Connecting..." : "Connect Actual Wallet"}
        </button>

        {error && <p className="error-message">{error.message}</p>}
      </div>
    );
  }

  return (
    <div className="wallet-card">
      <h2>Actual Wallet Connected</h2>

      <div className="wallet-row">
        <span className="label">Wallet Address</span>
        <span className="value">{formatAddress(address)}</span>
      </div>

      <div className="wallet-row">
        <span className="label">Network</span>
        <span className="value">{chain?.name ?? "Unknown"}</span>
      </div>

      <div className="wallet-row">
        <span className="label">Native Balance</span>
        <span className="value">
          {isLoading && "Loading..."}
          {isError && "Balance unavailable"}
          {!isLoading && !isError && balance && (
            <>
              {formatBalance(balance.formatted)} {balance.symbol}
            </>
          )}
        </span>
      </div>

      <button
        className="secondary-button"
        type="button"
        onClick={() => disconnect()}
      >
        Disconnect
      </button>
    </div>
  );
}
```

---

### `src/App.tsx`

This file controls the mode toggle between Demo Balance and Actual Wallet.

```tsx
import { useState } from "react";
import { sepolia } from "wagmi/chains";
import { ActualWalletBalance } from "./components/ActualWalletBalance";
import { DemoBalance } from "./components/DemoBalance";
import "./App.css";

type BalanceMode = "demo" | "actual";

function App() {
  const [mode, setMode] = useState<BalanceMode>("demo");
  const [selectedChainId, setSelectedChainId] = useState<number>(sepolia.id);

  return (
    <main className="app">
      <section className="hero">
        <h1>Native Token Balance Display</h1>

        <p>
          View a native token balance next to a wallet address using wagmi.
          Choose demo mode for safe public address data or connect an actual
          wallet.
        </p>

        <div className="mode-toggle">
          <button
            type="button"
            className={mode === "demo" ? "tab active-tab" : "tab"}
            onClick={() => setMode("demo")}
          >
            Demo Balance
          </button>

          <button
            type="button"
            className={mode === "actual" ? "tab active-tab" : "tab"}
            onClick={() => setMode("actual")}
          >
            Actual Wallet
          </button>
        </div>

        {mode === "demo" ? (
          <DemoBalance
            selectedChainId={selectedChainId}
            onChainChange={setSelectedChainId}
          />
        ) : (
          <ActualWalletBalance />
        )}
      </section>
    </main>
  );
}

export default App;
```

---

### `src/App.css`

Main styling for the application.

```css
.app {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f5f7fb;
  color: #111827;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
}

.hero {
  width: 100%;
  max-width: 560px;
  text-align: center;
}

.hero h1 {
  margin-bottom: 12px;
  font-size: 36px;
  line-height: 1.1;
}

.hero p {
  margin-bottom: 24px;
  color: #4b5563;
}

.mode-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 16px;
}

.tab {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #ffffff;
  color: #374151;
  font-weight: 600;
  cursor: pointer;
}

.active-tab {
  background: #111827;
  color: #ffffff;
  border-color: #111827;
}

.wallet-card {
  margin: 0 auto;
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  text-align: left;
}

.wallet-card h2 {
  margin: 0 0 8px;
  font-size: 22px;
}

.wallet-card p {
  margin: 0 0 20px;
  color: #6b7280;
}

.wallet-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.label {
  color: #6b7280;
}

.value {
  font-weight: 600;
  text-align: right;
}

.select-label {
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-weight: 600;
}

.chain-select {
  width: 100%;
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #ffffff;
  font-size: 14px;
}

.primary-button,
.secondary-button {
  width: 100%;
  margin-top: 20px;
  padding: 12px 16px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.primary-button {
  background: #111827;
  color: #ffffff;
}

.secondary-button {
  background: #e5e7eb;
  color: #111827;
}

.primary-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.error-message {
  margin-top: 12px !important;
  color: #dc2626 !important;
  font-size: 14px;
}
```

---

### `src/index.css`

Base global styles.

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
}
```

---

## How Balance Fetching Works

The app uses wagmi's `useBalance` hook.

In Demo Balance Mode:

```tsx
useBalance({
  address: demoAddress,
  chainId: selectedChainId,
});
```

This fetches the real native token balance of the public demo address from the selected network.

In Actual Wallet Mode:

```tsx
useBalance({
  address,
  chainId: chain?.id,
});
```

This fetches the real native token balance of the connected wallet.

---

## Where the Balance Comes From

The balance is read from the blockchain through RPC endpoints configured in:

```txt
src/wagmiConfig.ts
```

Example:

```ts
[mainnet.id]: http("https://ethereum-rpc.publicnode.com")
```

When Ethereum is selected, the app sends a read request through the Ethereum RPC endpoint.

When Polygon is selected, the app sends a read request through the Polygon RPC endpoint.

When BNB Chain is selected, the app sends a read request through the BNB Chain RPC endpoint.

This means Demo Balance Mode is not using fake static data. It is reading the current on-chain balance of a public address.

---

## Changing the Demo Address

To change the public demo wallet address, open:

```txt
src/components/DemoBalance.tsx
```

Find:

```ts
const demoAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
```

Replace it with another public wallet address:

```ts
const demoAddress = "YOUR_PUBLIC_DEMO_ADDRESS_HERE";
```

Important:

- Do not use a private key.
- Do not use a seed phrase.
- Only use a public wallet address.
- A public wallet address is safe to display because it cannot be used to spend funds.

---

## Testing Checklist

### Demo Balance Mode

1. Run the app:

```bash
npm run dev
```

2. Open:

```txt
http://localhost:5173
```

3. Make sure `Demo Balance` tab is selected.

4. Select each network:

```txt
Sepolia Testnet
Ethereum
Polygon
BNB Chain
```

5. Confirm the UI displays:

```txt
Wallet Address
Native Balance
Token Symbol
```

Expected symbols:

```txt
Ethereum: ETH
Sepolia: ETH
Polygon: MATIC
BNB Chain: BNB
```

### Actual Wallet Mode

1. Click `Actual Wallet`.

2. Click `Connect Actual Wallet`.

3. Approve the connection in MetaMask.

4. Confirm the UI displays:

```txt
Wallet Address
Network
Native Balance
```

5. Switch networks in MetaMask and verify the displayed network/balance updates.

---

## Troubleshooting

### Provider not found

Error:

```txt
Provider not found
```

Reason:

```txt
No browser wallet provider was found.
```

Fix:

- Install MetaMask.
- Use Chrome, Brave, or Edge.
- Do not use VS Code preview browser.
- Use Demo Balance Mode if you do not want to connect a wallet.

---

### Balance unavailable

Reason:

```txt
The RPC request failed, the selected network is temporarily unavailable, or the public RPC endpoint is rate-limited.
```

Fix:

- Click `Retry`.
- Select another network.
- Restart the dev server.
- Replace RPC endpoints in `src/wagmiConfig.ts` with a dedicated provider.

---

### Connect Wallet does not show in Network tab

This is expected.

Wallet connection uses the browser wallet provider, such as MetaMask's injected provider, not a normal HTTP request.

Demo balance fetching does use HTTP RPC calls, so those requests may appear in the Network tab.

---

### Very large ETH balance shown

If the selected public demo address is a well-known contract or large holder, the balance may be very large.

This is normal because Demo Balance Mode reads real blockchain data.

To use a different address, update:

```txt
src/components/DemoBalance.tsx
```

Change:

```ts
const demoAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
```

---

## Security Notes

This project never asks for:

- Private keys
- Seed phrases
- Passwords
- Personal wallet credentials

Demo Balance Mode only uses a public wallet address.

Actual Wallet Mode uses the browser wallet provider, such as MetaMask. The user remains in control of wallet permissions.

---

## Git Commands

Initialize Git:

```bash
git init
```

Create a feature branch:

```bash
git checkout -b feature/native-token-balance
```

Check changes:

```bash
git status
```

Stage files:

```bash
git add .
```

Commit:

```bash
git commit -m "Add native token balance display"
```

---

## Final Summary

This project implements a native token balance display using React, TypeScript, wagmi, and viem.

It provides:

- Safe demo mode using a public wallet address
- Optional actual wallet connection
- Real on-chain balance fetching
- Multi-chain support
- Balance formatting to 4 decimal places
- Clean reusable utility functions
- Simple and reviewer-friendly UI

<img width="714" height="565" alt="Screenshot 2026-05-26 at 03 51 21" src="https://github.com/user-attachments/assets/542bb5f2-0c64-4f12-9092-8036e61463e2" />

