const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  sex: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  castrated: {
    type: String,
    enum: ['yes', 'no'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Cat', catSchema);
