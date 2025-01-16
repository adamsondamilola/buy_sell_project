/*function formatNumberToCurrency(number, locale = 'en-US', currency = 'USD') {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(number);
  }*/

  function formatNumberToCurrency(number, locale = 'en-US', currency = 'NGN') {
    //return new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(number);
    if(isNaN(number)) return "₦0"
        else return "₦"+number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  export default formatNumberToCurrency