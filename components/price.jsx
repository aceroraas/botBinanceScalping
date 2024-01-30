import { useState, useEffect } from "react";
import getSocket from "../lib/sockets";
import { numberFormat } from "../lib/numberformat";
import { GlobalPrice, Symbol } from "../lib/stores/stores";
import { useStore } from "@nanostores/react";

export default function Price() {
  const [price, setPrice] = useState(0);
  const par = useStore(Symbol);
  useEffect(() => {
    const socket = getSocket("trade", par);
    socket.onmessage = ({ data }) => {
      const { p } = JSON.parse(data);
      setPrice(numberFormat(p));
      GlobalPrice.set(p);
    };
    socket.onerror = (error) => {
      console.log(error);
    };
  }, [par, GlobalPrice]);
  return <span className="text-md font-bold w-20">{price}</span>;
}
