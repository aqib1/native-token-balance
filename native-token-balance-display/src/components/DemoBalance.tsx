import { useBalance } from "wagmi";
import { mainnet, polygon, bsc, sepolia } from "wagmi/chains";
import { formatUnits } from "viem";
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

  const formattedNativeBalance = balance
    ? formatUnits(balance.value, balance.decimals)
    : undefined;

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
              {formatBalance(formattedNativeBalance)} {balance.symbol}
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