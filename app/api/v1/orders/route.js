import Binance from 'binance-api-node';
import { NextResponse } from 'next/server';
import Bottleneck from 'bottleneck';

// Crea un nuevo limitador de velocidad
const limiter = new Bottleneck({
   minTime: 200, // Tiempo mínimo entre solicitudes (en milisegundos)
});

export async function POST(req) {
   try {
      let p = await req.json();
      // Envuelve tu solicitud en el limitador de velocidad
      let response = await limiter.schedule(async () => {
         // Crea el cliente de Binance
         const client = Binance({
            apiKey: process.env.BINANCE_PUBLIC_KEY,
            apiSecret: process.env.BINANCE_SECRET_KEY,
            getTime: () => Date.now(),
         });

         // Asegúrate de que los parámetros requeridos están presentes
         if (!p.symbol || !p.side || !p.type) {
            throw new Error("Faltan parámetros requeridos");
         }

         // Prepara los parámetros para la orden
         let orderParams = {
            symbol: p.symbol,
            side: p.side,
            type: p.type,
         };

         // Añade 'quantity' o 'quoteOrderQty' a los parámetros dependiendo del tipo de orden
         if (p.side.toLowerCase() === 'buy') {
            orderParams.quoteOrderQty = p.quoteOrderQty;
         } else if (p.side.toLowerCase() === 'sell') {
            orderParams.quantity = p.quantity;
         }

         // Realiza la llamada a la API
         const order = await client.orderTest(orderParams);
         console.log(order);
         return order;
      });

      // Comprueba si la solicitud fue exitosa
      if (!response) {
         throw new Error(`Error en la solicitud: ${JSON.stringify(response)}`);
      }
      return NextResponse.json(response, { status: 200 });
   } catch (error) {
      console.error(error);  // Imprime el error en la consola para depuración
      return NextResponse.json({ error: error.message }, { status: 422 });
   }
}
