// Requires
const mongoose = require('mongoose');
const _ = require('underscore');

// Helper function to trim names
const setString = (value) => _.escape(value).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setString,
  },
  age: {
    type: Number,
    min: 0,
    requried: true,
  },
  job: {
    type: String,
    required: true,
    trim: true,
    set: setString,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// toAPI function for being able to store in Redis
DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  job: doc.job,
  age: doc.age,
});

// Creates and Exports the Model
const DomoModel = mongoose.model('Domo', DomoSchema);
module.exports = DomoModel;
