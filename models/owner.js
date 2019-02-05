const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect(process.env.MONGODB_URI);

const ownerSchema = Schema({
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
    businessEmail: {
      type: String,
      required: true,
    },
    businessAddress: {
      type: String,
      required: true,
    },
    location: {
      type: Object,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
});

module.exports = {
  Owner: mongoose.model('Owner', ownerSchema)
};
