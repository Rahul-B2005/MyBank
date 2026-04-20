const mongoose = require("mongoose");

// Generate Transaction ID
const generateTransactionId = () => {
  return "TXN" + Date.now() + Math.floor(Math.random() * 1000);
};

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      unique: true,
      default: generateTransactionId   // ⭐ AUTO CREATE
    },

    accountNumber: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: ["Deposit", "Withdraw"],
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    balanceAfterTransaction: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);