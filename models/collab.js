const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect(process.env.MONGODB_URI);

const collabSchema = mongoose.Schema({
    campaign: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true
    },
    ambassador: {
      type: Schema.Types.ObjectId,
      ref: 'Ambassador',
      required: true
    },
    checkins: {
      type: Array,
      required: true,
    },
});

module.exports = {
  Collab: mongoose.model('Collab', collabSchema)
};
