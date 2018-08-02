const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

const ambassadorSchema = mongoose.Schema({
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
      required: true
    },
    password: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false
    },
    contact: {
      type: String,
      required: true,
    },
    campaigns: {
      type: Array,
      required: true,
    },
});

module.exports = {
  Ambassador: mongoose.model('Ambassador', ambassadorSchema)
};
