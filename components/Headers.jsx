import { useEffect, useState } from "react";
import Price from "./price";
import { Symbol } from "@/lib/stores/stores";
import ModeSwitchComponent from "./ModeSwitchComponent";
import SpotBalanceComponent from "./SpotBalanceComponent";
import StartStopButton from "./StartStopButton";
import TestSwitchComponent from "./TestSwitchComponent";
export default function Header() {
  const [trade1, setTrade1] = useState("BTC");
  const [trade2, setTrade2] = useState("USDT");
  useEffect(() => {
    let urlParams = new URLSearchParams(window.location.search);
    let trade = urlParams.get("trade") || undefined;
    if (trade != undefined) {
      setTrade1(trade.split("-")[0].toUpperCase());
      setTrade2(trade.split("-")[1].toUpperCase());
    }
  }, []);
  useEffect(() => {
    Symbol.set(`${(trade1 + trade2).toUpperCase()}`);
  }, [trade1, trade2]);
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 flex items-center justify-between">
      <div className="flex flex-row items-center gap-4">
        <span className="text-md text-gray-700 dark:text-gray-300">
          {`${trade1}${trade2}`}
        </span>
        <Price />
        <ModeSwitchComponent />
        <TestSwitchComponent />
      </div>
      <div className="flex items-center gap-4">
        <SpotBalanceComponent />
        <StartStopButton />
        {/*  <Button
       className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 dark:bg-green-400 dark:hover:bg-green-500">
       Start Scalping
     </Button>
     <Button
       className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 dark:bg-red-400 dark:hover:bg-red-500">
       Stop Scalping
     </Button> */}
      </div>
    </header>
  );
}
