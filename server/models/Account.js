// models/Account.js

const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  city: {
    type: String,
    required: true
  },

  pincode: {
    type: String,
    required: true
  },

  accountType: {
    type: String,
    enum: ["Savings", "Current"],
    default: "Savings"
  },

  accountNumber: {
    type: String,
    unique: true
  },

  balance: {
    type: Number,
    default: 0
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Account", accountSchema);