import { MaxOperations } from "@/lib/stores/stores";
import { useStore } from "@nanostores/react";

function MaxOperationsComponent() {
  const maxOperations = useStore(MaxOperations);

  return (
    <div className="p-2">
      <label
        className="block text-gray-700 text-sm font-bold mb-1"
        htmlFor="MaxOperations"
      >
        Total de operaciones Activas
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="maxOperations"
        type="number"
        min={1}
        value={maxOperations}
        onChange={(e) => MaxOperations.set(e.target.value)}
      />
    </div>
  );
}

export default MaxOperationsComponent;
