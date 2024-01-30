//only client lib
const locale = "es-VE"
const numberFormat = (val) => new Intl.NumberFormat(locale).format(val);
export { locale, numberFormat }