import {
  GlobalPrice,
  MaxOperations,
  MaxTradePrice,
  TakeTradePrice,
  TradeBalance,
} from "@/lib/stores/stores";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";

function MaxTradePriceComponent() {
  const maxTradePrice = useStore(MaxTradePrice);
  const takeTradePrice = useStore(TakeTradePrice);
  const maxOperations = useStore(MaxOperations);
  const tradeBalance = useStore(TradeBalance);
  useEffect(() => {
    let amount = TradeBalance.get() / MaxOperations.get();
    MaxTradePrice.set(
      parseFloat(
        (amount + takeTradePrice) / (amount / GlobalPrice.get()) / amount
      ).toFixed(3)
    );
  }, [takeTradePrice, TradeBalance, MaxOperations, GlobalPrice]);

  useEffect(() => {
    let amount = TradeBalance.get() / maxOperations;
    MaxTradePrice.set(
      parseFloat(
        (amount + TakeTradePrice.get()) / (amount / GlobalPrice.get()) / amount
      ).toFixed(3)
    );
  }, [TakeTradePrice, TradeBalance, maxOperations, GlobalPrice]);

  useEffect(() => {
    let amount = tradeBalance / MaxOperations.get();
    MaxTradePrice.set(
      parseFloat(
        (amount + TakeTradePrice.get()) / (amount / GlobalPrice.get()) / amount
      ).toFixed(3)
    );
  }, [TakeTradePrice, tradeBalance, MaxOperations, GlobalPrice]);

  return (
    <div className="p-2">
      <label
        className="block text-gray-700 text-sm font-bold mb-1"
        htmlFor="MaxTradePrice"
      >
        Rango Superior
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="MaxTradePrice"
        type="number"
        min={0}
        value={isNaN(maxTradePrice) ? 0 : maxTradePrice}
        onChange={(e) => MaxTradePrice.set(e.target.value)}
      />
    </div>
  );
}

export default MaxTradePriceComponent;
