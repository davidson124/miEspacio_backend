/*
Devuelve el nombre del servicio en orden de prioridad:
  1. serviceSnapshot.title
  2. specificService
  3. service.title poblado
  4. N/A
*/
const getQuoteServiceTitle = (quote) => {
  return (
    quote?.serviceSnapshot?.title ||
    quote?.specificService ||
    quote?.service?.title ||
    "N/A"
  );
};
export default getQuoteServiceTitle;