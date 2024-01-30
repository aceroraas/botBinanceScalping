"use client";
import OperationsLog from "./operationsLogs";
import Header from "./Headers";
import TradeBalanceComponent from "./TradeBalanceComponent";
import MaxOperationsComponent from "./MaxOperationsComponent";
import LossTradePriceComponent from "./LossTradePriceComponent";
import MaxTradePriceComponent from "./MaxTradePriceComponent";
import MinTradePriceComponent from "./MinTradePriceComponent";
import TakeTradePriceComponent from "./TakeTradePriceComponent";
import { Suspense } from "react";
import { useStore } from "@nanostores/react";
import {
  ActiveOperations,
  GlobalPrice,
  MaxOperations,
  SymbolInfo,
  TradeBalance,
} from "@/lib/stores/stores";
import { numberFormat } from "@/lib/numberformat";

export default function Main() {
  const activeOperations = useStore(ActiveOperations);
  const symbolInfo = useStore(SymbolInfo);
  const globalPrice = useStore(GlobalPrice);
  const tradeBalance = useStore(TradeBalance);
  const maxOperations = useStore(MaxOperations);

  return (
    <div key="1" className="min-h-screen bg-gray-700 dark:bg-gray-900">
      <Header />
      <Suspense fallback={<span>Cargando...</span>}>
        <main className="p-6">
          <div className="w-full rounded p-3 bg-white mb-4">
            <div className="text-black">
              <h2 className="text-lg font-semibold mb-2">
                Configuración de operaciones
              </h2>
              <hr />
              <div className="text-sm mt-2 mb-2">
                Tomar todas las precauciones posibles antes de presionar INICIAR
              </div>
            </div>
            <div className="mt-2 p-4 flex flex-row flex-wrap gap-2 justify-between">
              <MaxOperationsComponent />
              <TradeBalanceComponent />
              <LossTradePriceComponent />
              <TakeTradePriceComponent />
              <MaxTradePriceComponent />
              <MinTradePriceComponent />
            </div>
            <hr />
            <div className="text-sm mt-2 mb-2 text-black flex flex-row gap-2 items-center font-medium justify-between">
              <label>Operaciones Activas: {activeOperations}</label>
              <label>
                Monto Mínimo por Operación:
                {numberFormat(
                  (
                    symbolInfo?.filters.find((f) => f.filterType == "LOT_SIZE")
                      .minQty * globalPrice
                  ).toFixed(3)
                )}{" "}
                {symbolInfo?.quoteAsset}
              </label>
              <label>
                Monto por Operaciones:
                {numberFormat((tradeBalance / maxOperations).toFixed(3))}{" "}
                {symbolInfo?.quoteAsset}
              </label>
            </div>
          </div>
          <div className="w-full rounded p-3 bg-white">
            <OperationsLog />
          </div>
        </main>
      </Suspense>
    </div>
  );
}
