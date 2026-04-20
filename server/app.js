const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= DATABASE =================
mongoose.connect(
  "mongodb+srv://Rahul:Rahul123$@cluster0.dflixki.mongodb.net/mybank",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("DB Error:", err));


// ================= MODELS =================
const User = require("./models/User");
const Account = require("./models/Account");
const Transaction = require("./models/Transaction");
const Contact = require("./models/Contact");


// ===================================================
// ✅ CONTACT
// ===================================================
app.post("/contact", async (req, res) => {
  try {
    await Contact.create(req.body);
    res.json({ message: "Message sent successfully!" });
  } catch {
    res.status(500).json({ message: "Error saving message" });
  }
});


const axios = require("axios");
// ===================================================
// ✅ REGISTER
// ===================================================
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, captcha } = req.body;

    // ================= VALIDATION =================
    if (!name || !email || !password)
      return res.status(400).json({
        message: "All fields required"
      });

    if (!captcha)
      return res.status(400).json({
        message: "Captcha required"
      });

    // ================= CAPTCHA VERIFY =================
    const SECRET_KEY = "6LdjKqksAAAAAJVxUOfTLB2baF1BLVYHHWr2ZN6B";

    const verifyURL =
      `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${captcha}`;

    const captchaResponse = await axios.post(verifyURL);

    if (!captchaResponse.data.success)
      return res.status(400).json({
        message: "Captcha verification failed"
      });

    // ================= PASSWORD RULE =================
    if (password.length < 6)
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });

    // ================= USER EXIST CHECK =================
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({
        message: "User already exists"
      });

    // ================= HASH PASSWORD =================
    const hashedPassword = await bcrypt.hash(password, 10);

    // ================= SAVE USER =================
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
});


// ===================================================
// ✅ LOGIN
// ===================================================
app.post("/login", async (req, res) => {
  try {
    const { username, password, captcha } = req.body;

    /* ===== CAPTCHA CHECK ===== */
    if (!captcha)
      return res.status(400).json({ message: "Captcha required" });

    const SECRET_KEY = "6LdjKqksAAAAAJVxUOfTLB2baF1BLVYHHWr2ZN6B";

    const verifyURL =
      `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${captcha}`;

    const captchaResponse = await axios.post(verifyURL);

    if (!captchaResponse.data.success)
      return res.status(400).json({
        message: "Captcha verification failed"
      });

    /* ===== USER CHECK ===== */
    const user = await User.findOne({ email: username });

    if (!user)
      return res.status(400).json({
        message: "User not found"
      });

    /* ===== PASSWORD CHECK ===== */
    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(400).json({
        message: "Invalid password"
      });

    /* ===== SUCCESS ===== */
    res.json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Login error"
    });
  }
});
// ============================================================
// ACCOUNT NUMBER GENERATOR (10 DIGIT)
// ============================================================
const generateAccountNumber = () => {
  return Math.floor(
    1000000000 + Math.random() * 9000000000
  ).toString();
};


// ============================================================
// ✅ OPEN ACCOUNT API
// ============================================================
app.post("/account/open", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      pincode,
      accountType,
      initialDeposit,
    } = req.body;

    // ---------- VALIDATION ----------
    if (!name || !email || !phone || !initialDeposit) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    // ---------- CREATE ACCOUNT ----------
    const accountNumber = generateAccountNumber();

    const newAccount = new Account({
      name,
      email,
      phone,
      address,
      city,
      pincode,
      accountType,
      accountNumber,
      balance: Number(initialDeposit),
    });

    await newAccount.save();

    res.status(201).json({
      message: "Account created successfully",
      accountNumber,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});
// ============================================================
// ✅ TRANSACTION API (Deposit / Withdraw)
// ============================================================
/* ================= TRANSACTION ================= */
app.post("/transaction", async (req, res) => {
  try {
    const { accountNumber, type, amount } = req.body;

    const amt = Number(amount);

    if (!accountNumber || !type || amt <= 0) {
      return res.status(400).json({
        message: "Invalid data"
      });
    }

    const account = await Account.findOne({ accountNumber });

    if (!account) {
      return res.status(404).json({
        message: "Account not found"
      });
    }

    // ===== Deposit / Withdraw =====
    if (type === "Deposit") {
      account.balance += amt;
    } else {
      if (account.balance < amt) {
        return res.status(400).json({
          message: "Insufficient balance"
        });
      }
      account.balance -= amt;
    }

    await account.save();

    // ⭐ Generate Transaction ID
    const txnId = "TXN" + Date.now();

    const transaction = new Transaction({
      accountNumber,
      type,
      amount: amt,
      balanceAfterTransaction: account.balance,
      transactionId: txnId
    });

    await transaction.save();

    // ⭐ SEND transactionId TO FRONTEND
    res.json({
      message: "Transaction Successful",
      transactionId: txnId,
      accountNumber,
      type,
      amount: amt,
      balanceAfterTransaction: account.balance
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
});
// ================= PASSBOOK =================
app.get("/transactions/:accountNumber", async (req, res) => {
  try {
    const txns = await Transaction.find({
      accountNumber: req.params.accountNumber
    }).sort({ createdAt: -1 });

    res.json(txns);
  } catch (err) {
    res.status(500).json({ message: "Error loading passbook" });
  }
});

// ============================================================
// ✅ GET ACCOUNT DETAILS
// ============================================================
app.get("/account/:accountNumber", async (req, res) => {
  try {
    const account = await Account.findOne({
      accountNumber: req.params.accountNumber,
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    res.json(account);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});



const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
}); 