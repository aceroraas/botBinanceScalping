import Binance from 'binance-api-node';
import { NextResponse } from 'next/server';
import Bottleneck from 'bottleneck';

// Crea un nuevo limitador de velocidad
const limiter = new Bottleneck({
   minTime: 200, // Tiempo mínimo entre solicitudes (en milisegundos)
});

export async function GET(req) {
   try {
      const symbol = req.nextUrl.searchParams.get('pair');
      let response = await limiter.schedule(async () => {
         const client = Binance({
            apiKey: process.env.BINANCE_PUBLIC_KEY,
            apiSecret: process.env.BINANCE_SECRET_KEY,
            getTime: () => Date.now(),
         });
         const info = await client.exchangeInfo();
         for (const pair of info.symbols) {
            if (pair.symbol === symbol) {
               return pair;
            }
         }
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