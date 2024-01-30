import { SymbolInfo, TradeBalance } from "@/lib/stores/stores";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";

function TradeBalanceComponent() {
  const minTradeBalance = useStore(TradeBalance);
  const parInfo = useStore(SymbolInfo);
  return (
    <div className="p-2">
      <label
        className="block text-gray-700 text-sm font-bold mb-1"
        htmlFor="TradeBalance"
      >
        {parInfo?.quoteAsset} total a utilizar
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="TradeBalance"
        type="number"
        min={0}
        value={minTradeBalance}
        onChange={(e) => TradeBalance.set(e.target.value)}
      />
    </div>
  );
}

export default TradeBalanceComponent;
