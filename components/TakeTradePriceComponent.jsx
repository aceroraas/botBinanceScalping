import { SymbolInfo, TakeTradePrice } from "@/lib/stores/stores";
import { useStore } from "@nanostores/react";
import { Suspense } from "react";

function TakeTradePriceComponent() {
  const takeTradePrice = useStore(TakeTradePrice);
  const parInfo = useStore(SymbolInfo);

  return (
    <div className="p-2">
      <label
        className="block text-gray-700 text-sm font-bold mb-1"
        htmlFor="takeTradePrice"
      >
        {parInfo?.quoteAsset} Máximo a esperar por operación
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="takeTradePrice"
        type="number"
        min={0}
        value={takeTradePrice}
        onChange={(e) => TakeTradePrice.set(e.target.value)}
      />
    </div>
  );
}

export default TakeTradePriceComponent;
