const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

const ownerSchema = mongoose.Schema({
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true
    },
    businessName: {
      type: String,
      required: true,
    },
    businessDesc: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    campaigns: {
      type: Array,
      required: true,
    },
});

module.exports = {
  Owner: mongoose.model('Owner', ownerSchema)
};
