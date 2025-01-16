const formatFilePath = (str) => {
    let path = process.env.FILE_UPLOAD_ROOT_DEV;
    if(process.env.NODE_ENV!=='dev') path = process.env.FILE_UPLOAD_ROOT_PROD;
    return str.replaceAll(path, '/api/files').replaceAll('\\', '/')
  }
  
  module.exports = formatFilePath  