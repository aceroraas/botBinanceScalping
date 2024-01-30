

import { atom, deepMap, map } from 'nanostores';

// señal de inicio o parada del bot
export const StartOps = atom(false);

export const IsRuning = atom(0);

// par de trading
export const Symbol = atom("BTCUSDT");
//operaciones
export const Operations = deepMap({ op: [] });

// precio del par en tiempo real
export const GlobalPrice = atom(0);

// balance de la cartera spot en binance
export const SpotBalance = atom(0);

// balance asignado para operar
export const TradeBalance = atom(0);

// máximo de operaciones ha realizar con balance asignado
export const MaxOperations = atom(1);

// operaciones activas abiertas
export const ActiveOperations = atom(0);

//cantidad máximo dispuesta a perder o ganar
export const LossTradePrice = atom(0);
export const TakeTradePrice = atom(0);

// rango mínimo y máximo de operaciones
export const MinTradePrice = atom(0);
export const MaxTradePrice = atom(0);


export const SymbolInfo = atom(null);
export const MinOperationBuySell = atom(0.0000100);

// El valor inicial es 1='seguro' 0='RealTime'
export const Mode = atom(0);

// El valor inicial es 1='test' 0='LIVE'
export const TestMode = atom(1);

export const StatusTypes = map({
   1: "Abierta",
   2: "Vendida",
   3: "Cerrada",
})