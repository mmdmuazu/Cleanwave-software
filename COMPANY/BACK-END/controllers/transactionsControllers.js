const {
  createTransaction,
  fetchTransactions,
} = require("../models/transactions.model");
const { deductBalance } = require("../services/updateBalance");
const knex = require("../db/knex");
const axios = require("axios");
exports.addTransaction = async (req, res) => {
  try {
    const { userId } = req.user;
    const { amount, type, description } = req.body;
    if (!amount || !type || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const transaction = await createTransaction({
      userId,
      amount,
      type,
      description,
    });
    if (transaction.success) {
      return res.status(200).json(transaction);
    } else {
      return res.status(400).json({ error: transaction.error });
    }
  } catch (err) {
    return res.status(403).json({ error: "Unauthorized" });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { userId } = req.user;
    const transactions = await fetchTransactions(userId);
    if (transactions.success) {
      return res.status(200).json({ transactions });
    } else {
      return res.status(400).json({ error: "No Transactions Found" });
    }
  } catch (err) {
    return res.status(403).json({ error: "Unauthorized" });
  }
};

exports.verifyAccount = async (req, res) => {
  try {
    const { accountNumber, bankCode } = req.body;
    console.log("Verifying account:", accountNumber, bankCode);

    const response = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response :", response);

    if (response.data.status) {
      return res.status(200).json({
        success: true,
        accountName: response.data.data.account_name,
      });
    } else {
      return res.status(400).json({ error: "Account verification failed" });
    }
  } catch (err) {
    console.error(
      "Paystack Verifi Unauthorized:",
      err || err.response?.data || err.message
    );
    return res
      .status(403)
      .json({ error: "Verification service currently unavailable" });
  }
};


    // Use your specific test data for debugging:
    // const amount = 100;

    // const accountNumber = "9038448811";
    // const bankCode = "999992"; // GTB bank code
    // const accountName = "MUHAMMAD ALIYU MUAZU";
exports.transfer = async (req, res) => {
  const trx = knex.transaction();
  try {
    const { userId } = req.user;
    const { accountNumber, bankCode, accountName, amount } = req.body;

    // 1. Fetch User & Check Balance
    const user = await knex("Users").where({ id: userId }).first();
    if (!user || user.balance < amount) {
      return res
        .status(400)
        .json({ error: "Insufficient balance or invalid user" });
    }

    // 2. Step One: Create Transfer Recipient
    const recipientResponse = await axios.post(
      "https://api.paystack.co/transferrecipient",
      {
        type: "nuban",
        name: accountName,
        account_number: accountNumber,
        bank_code: bankCode,
        currency: "NGN",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const recipientCode = recipientResponse.data.data.recipient_code;

    // 3. Step Two: Initiate Transfer
    const transferResponse = await axios.post(
      "https://api.paystack.co/transfer",
      {
        source: "balance",
        amount: amount * 100, // Convert to Kobo
        recipient: recipientCode,
        reason: "Waste Pickup Payout",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log("Transfer Response ::" ,transferResponse)
    if (transferResponse.data.status) {
      // 4. Deduct Balance & Record Transaction
      const deducted = await deductBalance({
        id: userId,
        amount,
        trx,
        // reference: transferResponse.data.data.reference,
      });
      // await addTransaction({
      //   userId,
      //   amount,
      //   type: "debit",
      //   reference: transferResponse.data.data.reference,
      // });
      console.log("Making deduction ::", deducted, userId, amount);

      if (deducted.success) {
        return res.status(200).json({
          success: true,
          message: "Transfer initiated successfully",
          data: transferResponse.data.data,
        });
      } else {
        return res.status(401).json({ success: false, error: deducted.error });
      }
    }
  } catch (err) {
    // Log the specific Axios error for debugging
    console.log("This is trUnauthorized:: ", err);
    console.error(
      "Paystack TrUnauthorized Detail:",
      err.response?.data || err.message
    );
    const errorMsg =
      err.response?.data?.message || "Transfer service currently unavailable";
    return res.status(403).json({ success: false, error: errorMsg });
  }
};

// module.exportsexports.getTransactions, };
