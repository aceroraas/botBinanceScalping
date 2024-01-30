import { numberFormat } from "@/lib/numberformat";
import { SpotBalance } from "@/lib/stores/stores";
import { useStore } from "@nanostores/react";

function SpotBalanceComponent() {
  const spotBalance = useStore(SpotBalance);

  // Aquí puedes usar la librería binance-api-node para obtener la información del usuario y actualizar el estado de SpotBalance

  return (
    <label className="block text-gray-700 dark:text-white text-sm font-semibold">
      Balance Spot: {numberFormat(spotBalance)}
    </label>
  );
}

export default SpotBalanceComponent;
