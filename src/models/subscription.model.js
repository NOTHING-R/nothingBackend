import mongoose, { mongo } from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    Subscriber: {
      type: mongoose.Types.ObjectId, //one who is subscribing
      ref: 'Users',
    },
    channel: {
      type: mongoose.Types.ObjectId, //one whome to 'subscriber' is subscribing to
      ref: 'Users',
    },
  },
  { timestamps: ture }
);

export const Subscription = mongoose.model('Subscription', subscriptionSchema);
