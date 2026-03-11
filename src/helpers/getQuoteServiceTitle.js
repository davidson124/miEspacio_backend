//Devuelve el nombre del servicio en orden de prioridad:
const getQuoteServiceTitle = (quote) => {
  return ( quote?.serviceSnapshot?.title || quote?.service?.title || "N/A" );
};
export default getQuoteServiceTitle;