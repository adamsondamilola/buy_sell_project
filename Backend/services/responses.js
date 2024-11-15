class ResponseService {
    static success(res, data, message = 'Success', statusCode = 200) {
      return res.status(statusCode).json({
        status: 'success',
        message,
        data
      });
    }
  
    static error(res, message = 'Something went wrong', statusCode = 500) {
      return res.status(statusCode).json({
        status: 'error',
        message
      });
    }
  
    static notFound(res, message = 'Resource not found') {
      return this.error(res, message, 404);
    }
  
    static unauthorized(res, message = 'Unauthorized') {
      return this.error(res, message, 401);
    }
  
    static badRequest(res, message = 'Bad request') {
      return this.error(res, message, 400);
    }
  }
  
  module.exports = ResponseService;
  