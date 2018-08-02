const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

const campaignSchema = mongoose.Schema({
    owner: {
      type: Schema.objectId,
      href: 'Owner',
    },
    ambassadors: {
      type: Array,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    goal: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: false,
    },
});

export default mongoose.model('Owner', ownerSchema);
