import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
import { formatUnits } from "viem";
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

  const formattedNativeBalance = balance
    ? formatUnits(balance.value, balance.decimals)
    : undefined;

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
              {formatBalance(formattedNativeBalance)} {balance.symbol}
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