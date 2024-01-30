import { ActiveOperations, GlobalPrice, LossTradePrice, MaxOperations, MaxTradePrice, MinTradePrice, Operations, SpotBalance, StartOps, TradeBalance, Symbol, TakeTradePrice, SymbolInfo, TestMode } from "./stores/stores";
const COMISION_BINANCE = 0.0001;
let operationsQueue = [];
let retryOperationsQueue = 0;
export default async function Bot() {
   try {
      let pairinfo = await fetch(`/api/v1/symbol?pair=${Symbol.get().trim().toUpperCase()}`);
      if (pairinfo.status == 200) {
         pairinfo = await pairinfo.json();
         SymbolInfo.set(pairinfo);
         let lastop = [];
         if (JSON.parse(localStorage.getItem("ops"))) {
            lastop = JSON.parse(localStorage.getItem("ops"));
         }
         Operations.setKey("op", [...lastop]);
         ActiveOperations.set(Operations.get().op.filter(f => f.status == 1).length);
      } else {
         if (ActiveOperations.get() <= 0) {
            StartOps.set(false);
         }
      }
      StartOps.subscribe(async (start) => {
         if (start) {
            watch();
            if (checkSpotBalance()) {
               if (checkTradeBalance()) {
                  if (checkLossTradePrice()) {
                     if (checkMinMax()) {
                        await prepareOperation();
                     };
                  }
               }
            }
            setInterval(processQueue, 1000);
            setInterval(callRetryOps, 1000);
         }
      });
   } catch (error) {
      console.error(error);
   }
}
async function checkSpotBalance() {
   try {
      if (TestMode.get() == 1) {
         return true;
      }
      if (SpotBalance.get() <= 0) {
         if (ActiveOperations.get() <= 0) {
            StartOps.set(false);
         }
         throw new Error("No hay Balance en Spot Para iniciar Bot");
      }
      return true;
   } catch (error) {
      console.error(error);
      return false;
   }
}
function checkTradeBalance() {
   try {
      if (TradeBalance.get() <= 0) {
         if (ActiveOperations.get() <= 0) {
            StartOps.set(false);
         }
         throw new Error("No haz Asignado Balance para operar e iniciar Bot");
      }
      let pairinfo = SymbolInfo.get();
      let min_sell = pairinfo.filters.find(f => f.filterType == 'LOT_SIZE').minQty * GlobalPrice.get();
      if ((TradeBalance.get() / MaxOperations.get) < min_sell) {
         if (ActiveOperations.get() <= 0) {
            StartOps.set(false);
         }
         throw new Error("El valor mínimo para una operación es 10");
      }
      return true;
   } catch (error) {
      console.error(error);
      return false;

   }
}
function checkLossTradePrice() {
   try {
      if (LossTradePrice.get() <= 0) {
         if (ActiveOperations.get() <= 0) {
            StartOps.set(false);
         }
         throw new Error("No haz Asignado un limite de perdida");
      }
      return true;
   } catch (error) {
      console.error(error);
      return false
   }
}
function checkMinMax() {
   try {
      if (MinTradePrice.get() <= 0) {
         if (ActiveOperations.get() <= 0) {
            StartOps.set(false);
         }
         throw new Error("No haz Asignado el mínimo del rango de operación");
      }
      if (MaxTradePrice.get() <= 0) {
         if (ActiveOperations.get() <= 0) {
            StartOps.set(false);
         }
         throw new Error("No haz Asignado el máximo del rango de operación");
      }
      return true;
   } catch (error) {
      console.error(error);
      return false;
   }
}
async function prepareOperation() {
   if (MaxOperations.get() > ActiveOperations.get()) {
      let { op: $operations } = Operations.get();
      let totalOperationsAmount = $operations.reduce((total, operation) => {
         return total + operation.amount;
      }, 0);
      if ((TradeBalance.get() - totalOperationsAmount) >= (TradeBalance.get() / MaxOperations.get())) {
         await createOperation();
      }
   }
}
function addToQueue(operation) {
   operationsQueue.push(operation);
}
function addRetryOpToQueue() {
   retryOperationsQueue += 1;
}
function processQueue() {
   if (StartOps.get()) {
      if (operationsQueue.length > 0) {
         const currentLot = new Set(operationsQueue);
         const actualOps = new Set(Operations.get().op);
         const merge = [...actualOps, ...currentLot];
         const cleanMerge = new Set(merge);
         Operations.setKey("op", [...cleanMerge]);
         localStorage.setItem("ops", JSON.stringify([...cleanMerge]));
         operationsQueue = [];
      }
   }
}
function callRetryOps() {
   if (StartOps.get()) {
      for (let i = 0; i < retryOperationsQueue; i++) {
         setTimeout(async () => await prepareOperation(), 5000);
         retryOperationsQueue -= 1;
      }
   }
}
function watch() {
   GlobalPrice.subscribe((price) => {
      ActiveOperations.set(Operations.get().op.filter(f => f.status == 1).length);
      let process = Operations.get().op.map((operation) => {
         let newOperation = { ...operation };
         if (newOperation.status == 1) {
            newOperation.profit = (newOperation.amount / newOperation.price) * (price - newOperation.comision) - newOperation.amount;
            if (isNaN(newOperation.profit)) {
               newOperation.profit = 0;
            }
            if (newOperation.price <= newOperation.stoploss) {
               ActiveOperations.set(ActiveOperations.get() - 1);
               newOperation.status = 3;
               SELL((newOperation.amount / newOperation.price), Symbol.get());
               addRetryOpToQueue();
            }
            if (newOperation.price >= newOperation.takeprofit) {
               ActiveOperations.set(ActiveOperations.get() - 1);
               newOperation.status = 2;
               SELL((newOperation.amount / newOperation.price), Symbol.get());
               addRetryOpToQueue();
            }
            if (Date.now() - newOperation.time >= 10000) {
               if (newOperation.profit >= 0.01) {
                  ActiveOperations.set(ActiveOperations.get() - 1);
                  newOperation.status = 2;
                  SELL((newOperation.amount / newOperation.price), Symbol.get());
                  addRetryOpToQueue();
               }
               if (newOperation.profit <= 0.01) {
                  addRetryOpToQueue();
               }
            }
         }
         return newOperation;
      });
      Operations.setKey("op", process);
   });
}
async function createOperation() {
   let price = GlobalPrice.get();
   if (price == 0) {
      if (ActiveOperations.get() <= 0) {
         StartOps.set(false);
      }
      return;
   }
   let amount = parseFloat(TradeBalance.get() / MaxOperations.get());
   let loss = parseFloat(MinTradePrice.get());
   let take = parseFloat(MaxTradePrice.get());
   let comision = parseFloat((amount / price) * COMISION_BINANCE);
   // Intenta comprar y verifica si la compra fue exitosa
   let buySuccessful = await BUY(amount, Symbol.get());
   if (!buySuccessful) {
      console.log("La compra no fue exitosa. No se creará la operación.");
      return;
   }
   let op = {
      id: Math.floor(Math.random() * 1000),
      time: new Date(),
      amount,
      comision,
      price,
      profit: 0,
      stoploss: loss,
      takeprofit: take,
      status: 1,
      symbol: Symbol.get()
   }
   addToQueue(op);
   ActiveOperations.set(ActiveOperations.get() + 1);
   console.log("Nueva Operación creada");
}
async function BUY(amount, symbol) {
   try {
      let pairinfo = SymbolInfo.get();
      amount = parseFloat(amount).toFixed(pairinfo.baseAssetPrecision)

      let params = {
         symbol: symbol.trim().toUpperCase(),
         side: "BUY",
         type: "MARKET",
         quoteOrderQty: parseFloat(amount).toFixed(pairinfo.quoteAssetPrecision),
      };
      // Intenta realizar la compra dos veces
      for (let i = 0; i < 5; i++) {
         if (i < 3) {
            const response = await fetch("/api/v1/orders", {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               }, body: JSON.stringify(params)
            });
            let data = await response.json();
            if (response.ok) {
               return data;
            }
            console.log(`Comprar en el intento ${i + 1}: `, data);
         }
      }
      addRetryOpToQueue();
      throw new Error("No se ha podido crear la operación operación");
   } catch (error) {
      console.error(error);
      return false
   }
}

async function SELL(amount, symbol) {
   try {
      let pairinfo = SymbolInfo.get();
      amount = parseFloat(amount).toFixed(pairinfo.baseAssetPrecision)
      let min_sell = pairinfo.filters.find(f => f.filterType == 'LOT_SIZE').minQty;

      console.log({ amount, min_sell });


      const params = {
         symbol: symbol.trim().toUpperCase(),
         side: 'SELL',
         type: "MARKET",
         quantity: amount
      };
      for (let i = 0; i < 5; i++) {
         const response = await fetch("/api/v1/orders", {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            }, body: JSON.stringify(params)
         });
         let data = await response.json();
         if (response.status == 200) {
            return true;
         }
         console.log(`Vender en el intento ${i + 1}: `, data);
      }
      throw new Error("No se ha podido vender la operación operación");
   } catch (error) {
      console.error(error);
      return false
   }
}