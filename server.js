const app = require('express')();
const server = require('http').Server(app);
const passport = require('passport');
const bodyParser = require('body-parser');
const port = 8080;
const mongoose = require('mongoose');
const Owner = require('./models/owner.js').Owner;
const Ambassador = require('./models/ambassador.js').Ambassador;

require('./services/passport');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app); //gives auth routes to app

mongoose.connection.on('connected', () => {
 console.log('Connected to MongoDb!');
});
mongoose.connect(process.env.MONGODB_URI);


server.listen(port, function(){
  console.log('listening on ' + port);
});
