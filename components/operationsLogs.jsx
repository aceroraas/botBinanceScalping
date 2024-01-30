import { Operations, StatusTypes } from "../lib/stores/stores";
import { useStore } from "@nanostores/react";
import moment from "moment";
import { numberFormat } from "../lib/numberformat";

export default function OperationsLog() {
  let { op: operations } = useStore(Operations);
  let statustype = useStore(StatusTypes);
  return (
    <div className="flex flex-col bg-gray-400 p-1 order-2 md:order-1">
      <table className="table-auto text-center">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm ">
            <th className="py-2 px-4">Tiempo</th>
            <th className="py-2 px-4">Inversión</th>
            <th className="py-2 px-4">Precio</th>
            <th className="py-2 px-4">Ganancia/Perdida</th>
            <th className="py-2 px-4">Mínimo Operable/salida</th>
            <th className="py-2 px-4">Máximo Operable/salida</th>
            <th className="py-2 px-4">Status</th>
            {/* <th className="py-2 px-4">Acción</th> */}
          </tr>
        </thead>
        <tbody>
          {operations.map((op) => {
            return (
              <tr
                key={op.id}
                className="bg-white text-gray-600 uppercase text-sm"
              >
                <td>{moment(op.time).format("D/M/YYYY hh:mm a")}</td>
                <td>{numberFormat(op.amount)}</td>
                <td>{numberFormat(op.price)}</td>
                <td>{numberFormat(op.profit)}</td>
                <td>{numberFormat(op.stoploss)}</td>
                <td>{numberFormat(op.takeprofit)}</td>
                <td>{statustype[op.status]}</td>
                {/* <td>Vender</td> */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
