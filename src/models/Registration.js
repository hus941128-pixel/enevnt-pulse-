const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['confirmed', 'cancelled'],
        message: 'Status must be confirmed or cancelled',
      },
      default: 'confirmed',
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

registrationSchema.index({ user: 1, event: 1 }, { unique: true });
registrationSchema.index({ event: 1 });
registrationSchema.index({ user: 1 });

module.exports = mongoose.model('Registration', registrationSchema);
