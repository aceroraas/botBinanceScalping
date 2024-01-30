// Crear los sockets fuera de las funciones para que sean persistentes
let sockets = {};

export default function getSocket(type, par) {
   const paths = {
      trade: '@trade',
      kline: '@kline_1s'
   };
   par = par.toLowerCase();
   if (!sockets[type]) {
      sockets[type] = new WebSocket(`wss://stream.binance.com:9443/ws/${par}${paths[type]}`);
      setInterval(() => {
         sockets[type].onping = () => {
            sockets[type].pong();
         };
      }, 240000);
   }
   return sockets[type];
}
