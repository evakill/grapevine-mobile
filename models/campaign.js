const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Owner = require('./owner.js').Owner;
const Ambassador = require('./ambassador.js').Ambassador;


mongoose.connect(process.env.MONGODB_URI);

const campaignSchema = mongoose.Schema({
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'Owner',
    },
    business: {
      type: String,
      required: true,
    },
    businessDesc:{
      type: String,
      required: true,
    },
    ambassadors: [{
      type: Schema.Types.ObjectId,
      ref: 'Ambassador'
    }],
    name: {
      type: String,
      required: true
    },
    startDate: {
      type: String,
      required: true
    },
    endDate: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    goal: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    progress: {
      type: Number,
      required: true,
    },
    type: {
      type: Number,
      required: true,
    },
    typeStr: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    event: {
      type: Object,
      required: false,
    },
    sale: {
      type: Object,
      required: false,
    },
    promotion:{
      type: Object,
      required: false
    },
});

module.exports = {
  Campaign: mongoose.model('Campaign', campaignSchema)
}
