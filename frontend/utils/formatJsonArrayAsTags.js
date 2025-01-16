export const formatJsonArrayAsTags = (str) => {
    if (str.length <= 1) {
      return str;
    }
    return str.replaceAll('\\",\\"', ',').replace('"[\\"', '').replace('\\"]"', '');
  };
  