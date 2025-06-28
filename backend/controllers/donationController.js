import Razorpay from 'razorpay';
import crypto from 'crypto';
import Donation from '../models/Donation.js';

console.log('✅ donationController loaded');


// Get all donations for a specific NGO
export const getDonationsForNgo = async (req, res) => {
  try {
    const ngoId = req.ngo.id; // retrieved from verified JWT

    const donations = await Donation.find({ ngoId }).sort({ createdAt: -1 });

    res.status(200).json(donations);
  } catch (err) {
    console.error('Error fetching donations:', err);
    res.status(500).json({ msg: 'Server error while fetching donations', error: err.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    console.log('🔑 Razorpay Key ID:', process.env.RAZORPAY_KEY_ID);

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount, donorName, donorEmail, message, ngoId } = req.body;

    const options = {
      amount: amount * 100, // paise
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ msg: 'Failed to create Razorpay order', error: err.message });
  }
};
export const verifyPayment = async (req, res) => {
  try {
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${req.body.razorpay_order_id}|${req.body.razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== req.body.razorpay_signature) {
      return res.status(400).json({ msg: 'Invalid payment signature' });
    }

    const donation = new Donation({
      donorName: req.body.donorName,
      donorEmail: req.body.donorEmail,
      amount: req.body.amount,
      message: req.body.message,
      ngoId: req.body.ngoId,
      paymentId: req.body.razorpay_payment_id,
      orderId: req.body.razorpay_order_id,
      status: 'success',
    });

    await donation.save();

    res.status(200).json({ msg: 'Payment verified and donation saved' });
  } catch (err) {
    console.error('Error verifying payment:', err);
    res.status(500).json({ msg: 'Server error during payment verification', error: err.message });
  }
};





























// import Razorpay from 'razorpay';
// import crypto from 'crypto';
// import Donation from '../models/Donation.js';

// // initialize Razorpay instance
// console.log('🔑 Razorpay Key ID:', process.env.RAZORPAY_KEY_ID);
// console.log('🔑 Razorpay Key Secret:', process.env.RAZORPAY_KEY_SECRET);

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });



// // POST /api/donation/create-order
// export const createOrder = async (req, res) => {
//   try {
//     const { amount, donorName, donorEmail, message, ngoId } = req.body;

//     // Convert amount to paise (smallest currency unit)
//     const payment_capture = 1;
//     const options = {
//       amount: amount * 100, // ₹100 → 10000 paise
//       currency: 'INR',
//       receipt: `receipt_order_${Date.now()}`,
//       payment_capture,
//     };

//     const order = await razorpay.orders.create(options);

//     res.status(200).json({
//       orderId: order.id,
//       currency: order.currency,
//       amount: order.amount,
//       key: process.env.RAZORPAY_KEY_ID,
//     });
//   } catch (err) {
//     console.error('Error creating order:', err);
//     res.status(500).json({ msg: 'Failed to create Razorpay order', error: err.message });
//   }
// };

// // POST /api/donation/verify
// export const verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donorName, donorEmail, amount, message, ngoId } = req.body;

//     const generated_signature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest('hex');

//     if (generated_signature !== razorpay_signature) {
//       return res.status(400).json({ msg: 'Invalid payment signature' });
//     }

//     const donation = new Donation({
//       donorName,
//       donorEmail,
//       amount,
//       message,
//       ngoId,
//       paymentId: razorpay_payment_id,
//       orderId: razorpay_order_id,
//       status: 'success',
//     });

//     await donation.save();

//     res.status(200).json({ msg: 'Payment verified and donation saved' });
//   } catch (err) {
//     console.error('Error verifying payment:', err);
//     res.status(500).json({ msg: 'Server error during payment verification', error: err.message });
//   }
// };



// // export const createOrder = async (req, res) => {
// //   try {
// //     console.log('🛒 Creating Razorpay order...');
// //     // actual Razorpay logic will go here later
// //     res.status(200).json({ msg: 'Create order placeholder hit' });
// //   } catch (err) {
// //     res.status(500).json({ msg: 'Server error', error: err.message });
// //   }
// // };

// // export const verifyPayment = async (req, res) => {
// //   try {
// //     console.log('✅ Verifying payment...');
// //     // actual signature verification logic will go here later
// //     res.status(200).json({ msg: 'Payment verification placeholder hit' });
// //   } catch (err) {
// //     res.status(500).json({ msg: 'Server error', error: err.message });
// //   }
// // };
