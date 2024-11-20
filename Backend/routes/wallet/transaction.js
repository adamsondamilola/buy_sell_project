const express = require('express');
const router = express.Router();
const Ad= require('../../models/Ad');
const User = require('../../models/User');
const Transaction= require('../../models/Transaction');
const authMiddleware = require('../../middleware/authMiddleware');
const adminAuthMiddleware = require('../../middleware/adminAuthMiddleware');
const ResponseService = require('../../services/responses');
const Flutterwave = require('flutterwave-node-v3');

// Create a new transaction
router.post('/create', authMiddleware, async (req, res) => {
    const userId = req.user.userId
  
  const { ad_id, product_id, transaction_id, amount, currency, description } = req.body;
  
  if(transaction_id == null){
    return ResponseService.badRequest(res, 'Transaction ID is required');
  }
  if(description == null){
    return ResponseService.badRequest(res, 'Description is required');
  }
  if(amount == null){
    return ResponseService.badRequest(res, 'Amount is required');
  }
  if(isNaN(amount)){
    return ResponseService.badRequest(res, 'Amount is invalid');
  }
  if(currency == null){
    return ResponseService.badRequest(res, 'Currency is required');
  }

  try {
    const newTransaction= new Transaction({
      user_id: userId,
      ad_id, 
      product_id, 
      transaction_id, 
      amount, 
      currency,
      description
    });

    await newTransaction.save();
    return ResponseService.success(res, newTransaction, 'Transaction created successfully but pending some actions');
  } catch (error) {
    return ResponseService.error(res, 'Error creating ads');
  }
});


// Get all transactions by user
router.get('/', authMiddleware, async (req, res) => {
    const userId = req.user.userId;
    const { page = 1, limit = 20 } = req.query;
  
    try {
      const transactions= await Transaction.find({ user_id: userId })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
  
      const totalTransactions= await Transaction.countDocuments({ user_id: userId });
      const totalPages = Math.ceil(totalTransactions/ limit);
  
      return ResponseService.success(res, {
        transactions,
        currentPage: parseInt(page),
        totalPages,
        totalTransactions,
      }, 'Transactions fetched successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error fetching ads');
    }
  });

// Get a single transactionby ID
router.get('/:id', async (req, res) => {
    const transactionId = req.params.id;
  
    try {
      const transaction= await Transaction.findById(transactionId);
      if (!transaction) {
        return ResponseService.notFound(res, 'Transaction not found');
      }
  
      return ResponseService.success(res, transaction, 'Transaction fetched successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error fetching ad');
    }
  });

// Update an transactionby ID. To approve, set status to 1, else 0. 2 to decline
router.put('/:id/admin', adminAuthMiddleware, async (req, res) => {
  try {
    const transaction= await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!transaction) {
      return ResponseService.notFound(res, "Transaction not found");
    }
    ResponseService.success(res, transaction, "Transaction updated");
  } catch (error) {
    ResponseService.error(res, error);
  }
});

// Delete a transaction by ID
router.delete('/:id', adminAuthMiddleware, async (req, res) => {
  try {
    const deletedTransaction= await Transaction.findByIdAndDelete(req.params.id);
    if (!deletedTransaction) {
      return ResponseService.notFound(res, "Transaction not found");
    }
    ResponseService.success(res, {}, "Transaction deleted");
  } catch (error) {
    ResponseService.error(res, error);
  }
});

//Verify Transaction - Flutterwave
router.get('/:id/transaction/verify', async (req, res) => {
    try {
        const transactionId = req.params.id;
        const transaction = await Transaction.findOne({transaction_id: transactionId});
      if (!transaction) {
        return ResponseService.notFound(res, "Transaction not found");
      }
      else if(transaction.status == 1){
        ResponseService.success(res, transaction, "Transaction approved");
      }
      else if(transaction.status == 2){
        ResponseService.success(res, transaction, "Transaction declined");
      }
    
      else if(transaction.status == 0){
        const ad= await Ad.findById(transaction.ad_id);
        //check transaction online
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
flw.Transaction.verify({ id: transactionId })
    .then(async (response) => {
        if (
            response.data.status === "successful"
            && response.data.amount === transaction.amount
            && response.data.currency === transaction.currency) {
            // Success! Confirm the customer's payment
            //update transaction status
            transaction.status = 1;
            await transaction.save();

            //update ads status
            if(ad){
                ad.status = 1;
                await ad.save();
            }

            ResponseService.success(res, transaction, "Transaction successful");

        } else {
            ResponseService.badRequest(res, "Invalid transaction")
            // Inform the customer their payment was unsuccessful
        }
    })
    .catch(console.log);
    
      }

      ResponseService.success(res, transaction, "Transaction verified");
    } catch (error) {
      ResponseService.error(res, error);
    }
  });

module.exports = router;
