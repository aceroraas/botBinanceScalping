import { TestMode } from "@/lib/stores/stores";
import { useStore } from "@nanostores/react";

function TestSwitchComponent() {
  const testMode = useStore(TestMode);

  const toggleMode = () => {
    TestMode.set(testMode === 0 ? 1 : 0);
  };

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        value=""
        className="sr-only peer"
        onClick={toggleMode}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      <span className="ms-2 text-sm font-medium text-gray-900 dark:text-white">
        Modo: {testMode === 1 ? "TEST" : "LIVE"}
      </span>
    </label>
  );
}

export default TestSwitchComponent;
