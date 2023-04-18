/* Plan for Song.js
Usage: Song will be a model that holds all the information for the song.
   Songs will be loaded by the homepage, or to be displayed on an account page.
   Songs can also be searched individually, and can be added to albums [stretch goal]
Elements: Song Name, Song File Name, data, owner, data uploaded
*/

// Imports
const mongoose = require('mongoose');
const _ = require('underscore');

// Helper function to trim given Name
const setString = (value) => _.escape(value).trim();

// Defines the Song Schema
const SongSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    trim: true,
    set: setString,
  },
  filename: {
    type: String,
    required: true,
  },
  data: {
    type: Buffer,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Create the Model and export it
const SongModel = mongoose.model('Song', SongSchema);
module.exports = SongModel;
