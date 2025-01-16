export const formatFile = (filePath) => {
    try{
      if (filePath.length <= 1) {
        return filePath;
      }
      let file = filePath.replaceAll("\\", "/")
      .replaceAll("C:/Users/adams/Desktop/Cpromoter_Store/cpromoter_store/Backend/uploads", "/api/files")
      .replaceAll("C:/Users/adams/Desktop/Buy_Sell_Project/buy_sell_project/uploads", "/api/files")
      .replaceAll("/home/cprottoi/buySell-api.cpromoter.com/uploads", "/api/files");
      return file
    }
    catch{
      return filePath;
    }
  };