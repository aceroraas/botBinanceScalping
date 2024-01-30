import { useStore } from "@nanostores/react";
import { StartOps } from "../lib/stores/stores";

export default function StartStopButton() {
  const $isStartOps = useStore(StartOps);
  return (
    <button
      onClick={() => {
        StartOps.set(!$isStartOps);
      }}
      className={`text-white font-bold py-1 px-2 rounded shadow-sm  ${
        $isStartOps
          ? "bg-red-500 hover:bg-red-700"
          : "bg-blue-500 hover:bg-blue-700"
      }`}
    >
      {$isStartOps ? "DETENER" : "INICIAR"}
    </button>
  );
}
