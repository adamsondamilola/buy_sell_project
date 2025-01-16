const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; // Algorithm for encryption
const secretKey = process.env.HASH_KEY;
const iv = crypto.randomBytes(16); // Initialization vector

// Function to encrypt data
const encrypt = (text) => {
  const jsonResponse = JSON.stringify(text); 
      const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
  let encrypted = cipher.update(jsonResponse);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };  
};

// Function to decrypt data
const decrypt = (encryption) => {
  const iv = Buffer.from(encryption.iv, 'hex');
  const encryptedText = Buffer.from(encryption.encryptedData, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
/*
// Example usage in an endpoint
app.post('/encrypt-response', (req, res) => {
  const data = req.body.data;
  const encrypted = encrypt(data);
  res.json(encrypted);
});

// Example usage for decryption
app.post('/decrypt-response', (req, res) => {
  const encrypted = req.body;
  const decrypted = decrypt(encrypted);
  res.json({ decryptedData: decrypted });
});*/

class ResponseService {
    static success(res, data, message = 'Success', statusCode = 200) {
      const response = {
        status: 'success',
        message,
        data
      }
      return res.status(statusCode).json(response);
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
  