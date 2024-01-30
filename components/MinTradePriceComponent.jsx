import {
  MinTradePrice,
  GlobalPrice,
  MaxOperations,
  TradeBalance,
  LossTradePrice,
} from "@/lib/stores/stores";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";

function MinTradePriceComponent() {
  const minTradePrice = useStore(MinTradePrice);
  const lossTradePrice = useStore(LossTradePrice);
  const maxOperations = useStore(MaxOperations);
  const tradeBalance = useStore(TradeBalance);
  useEffect(() => {
    let amount = TradeBalance.get() / MaxOperations.get();
    MinTradePrice.set(
      parseFloat(
        (amount - lossTradePrice) / (amount / GlobalPrice.get())
      ).toFixed(3)
    );
  }, [lossTradePrice, TradeBalance, MaxOperations, MinTradePrice, GlobalPrice]);
  useEffect(() => {
    let amount = TradeBalance.get() / maxOperations;
    MinTradePrice.set(
      parseFloat(
        (amount - LossTradePrice.get()) / (amount / GlobalPrice.get())
      ).toFixed(3)
    );
  }, [LossTradePrice, TradeBalance, maxOperations, MinTradePrice, GlobalPrice]);
  useEffect(() => {
    let amount = tradeBalance / MaxOperations.get();
    MinTradePrice.set(
      parseFloat(
        (amount - LossTradePrice.get()) / (amount / GlobalPrice.get())
      ).toFixed(3)
    );
  }, [LossTradePrice, tradeBalance, MaxOperations, MinTradePrice, GlobalPrice]);

  return (
    <div className="p-2">
      <label
        className="block text-gray-700 text-sm font-bold mb-1"
        htmlFor="MinTradePrice"
      >
        Rango Inferior
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="MinTradePrice"
        type="number"
        min={0}
        value={isNaN(minTradePrice) ? 0 : minTradePrice}
        onChange={(e) => MinTradePrice.set(e.target.value)}
      />
    </div>
  );
}

export default MinTradePriceComponent;
