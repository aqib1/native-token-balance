import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
import { formatUnits } from "viem";
import { formatAddress } from "../utils/formatAddress";
import { formatBalance } from "../utils/formatBalance";

export function WalletInfo() {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const metaMaskConnector = connectors.find(
    (connector) =>
      connector.name.toLowerCase().includes("metamask") ||
      connector.name.toLowerCase().includes("injected")
  );

  const {
    data: balance,
    isLoading: isBalanceLoading,
    isError: isBalanceError,
  } = useBalance({
    address,
    chainId: chain?.id,
    query: {
      enabled: Boolean(address && chain?.id),
      refetchInterval: 10_000,
    },
  });

  const formattedNativeBalance = balance
    ? formatUnits(balance.value, balance.decimals)
    : undefined;

  const handleConnect = () => {
    if (!metaMaskConnector) {
      alert("MetaMask is not available. Please install MetaMask or use Demo Mode.");
      return;
    }

    connect({ connector: metaMaskConnector });
  };

  if (!isConnected || !address) {
    return (
      <div className="wallet-card">
        <h2>Connect Test Wallet</h2>

        <p>
          Use a test MetaMask wallet only. Do not connect a wallet holding real
          funds for assignment/demo work.
        </p>

        <button
          className="primary-button"
          disabled={isPending}
          onClick={handleConnect}
        >
          {isPending ? "Connecting..." : "Connect MetaMask Test Wallet"}
        </button>

        {error && <p className="error-message">{error.message}</p>}
      </div>
    );
  }

  return (
    <div className="wallet-card">
      <h2>Test Wallet Connected</h2>

      <div className="wallet-row">
        <span className="label">Address</span>
        <span className="value">{formatAddress(address)}</span>
      </div>

      <div className="wallet-row">
        <span className="label">Network</span>
        <span className="value">{chain?.name ?? "Unknown"}</span>
      </div>

      <div className="wallet-row">
        <span className="label">Native Balance</span>

        <span className="value">
          {isBalanceLoading && "Loading..."}

          {isBalanceError && "Balance unavailable"}

          {!isBalanceLoading && !isBalanceError && balance && (
            <>
              {formatBalance(formattedNativeBalance, 4)} {balance.symbol}
            </>
          )}
        </span>
      </div>

      <button className="secondary-button" onClick={() => disconnect()}>
        Disconnect
      </button>
    </div>
  );
}