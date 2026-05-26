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
          Choose demo mode for safe test data or connect an actual wallet.
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