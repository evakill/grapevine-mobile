const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
    address: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true
    },
    campaigns: [{
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
    }],
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
  Ambassador: mongoose.model('Ambassador', ambassadorSchema)
};
