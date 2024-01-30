import { LossTradePrice, SymbolInfo, TradeBalance } from "@/lib/stores/stores";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";

function LossTradePriceComponent() {
  const lossTradePrice = useStore(LossTradePrice);
  const tradeBalance = useStore(TradeBalance);
  const parInfo = useStore(SymbolInfo);

  return (
    <div className="p-2">
      <label
        className="block text-gray-700 text-sm font-bold mb-1"
        htmlFor="lossTradePrice"
      >
        {parInfo?.quoteAsset} dispuesto a perder por operación
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="lossTradePrice"
        type="number"
        min={0}
        max={tradeBalance - 1}
        value={lossTradePrice}
        onChange={(e) => LossTradePrice.set(e.target.value)}
      />
    </div>
  );
}

export default LossTradePriceComponent;
