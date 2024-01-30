


export async function setFastestBaseUrl() {
   const urls = [
      'https://api.binance.com',
      'https://api-gcp.binance.com',
      'https://api1.binance.com',
      'https://api2.binance.com',
      'https://api3.binance.com',
      'https://api4.binance.com'
   ];

   let fastestUrl = '';
   let fastestTime = Infinity;

   for (const url of urls) {
      const start = Date.now();
      try {
         await fetch(url + '/api/v3/ping');
         const latency = Date.now() - start;
         if (latency < fastestTime) {
            fastestTime = latency;
            fastestUrl = url;
         }
      } catch (error) {
         console.error(`Error with ${url}:`, error);
      }
   }

   return fastestUrl;
}
/*
setFastestBaseUrl().then(fastestUrl => {
  console.log(`The base URL with the lowest latency is: ${fastestUrl}`);
}); */
