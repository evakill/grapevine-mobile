const app = require('express')();
const server = require('http').Server(app);
const passport = require('passport');
const bodyParser = require('body-parser');
const port = 8080;
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const Owner = require('./models/owner.js').Owner;
const Ambassador = require('./models/ambassador.js').Ambassador;
const Campaign = require('./models/campaign.js').Campaign;
const Collab = require('./models/collab.js').Collab;

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

io.on('connection', function(socket) {
  console.log('connected');

  socket.on('create campaign', function(create){
    console.log('create campaign socket')
    var event, sale, promotion;
    if(create.type === 0){
      event = {
        description: create.eventDescription,
        startDate: create.eventStartDate,
        endDate: create.eventEndDate,
        address: create.eventAddress,
        location: create.eventLocation,
        price: create.eventPrice,
      }
    }
    var newCampaign = new Campaign({
      owner: create.owner._id,
      business: create.owner.business,
      ambassadors: [],
      business: create.owner.businessName,
      businessDesc: create.owner.businessDesc,
      name: create.name,
      description: create.description,
      startDate: create.startDate,
      endDate: create.endDate,
      goal: create.goal,
      type: create.type,
      typeStr: create.typeStr,
      icon: create.type === 0 ? "event" : create.type === 1 ? "shopping-cart" : "assignment",
      price: create.price,
      progress: 0,
      event: event,
      sale: sale,
      promotion: promotion,
    });
    newCampaign.save(function(err, newCampaign){
      if(err) console.log(err);
      else {
        console.log('campaign saved');
        Campaign.find({owner: newCampaign.owner})
        .populate('ambassadors')
        .exec(function(err, resp){
          if(err) console.log(err);
          else socket.emit('new campaigns', resp);
        });
      }
    });
  });

  socket.on('edit campaign', function(edit){
    console.log('edit campaign socket')
    var event, sale, promotion;
    if(edit.type === 0){
      event = {
        description: edit.eventDescription,
        startDate: edit.eventStartDate,
        endDate: edit.eventEndDate,
        address: edit.eventAddress,
        location: edit.eventLocation,
        price: edit.eventPrice,
      }
    }
    Campaign.findByIdAndUpdate(edit.id, {
      name: edit.name,
      description: edit.description,
      startDate: edit.startDate,
      endDate: edit.endDate,
      goal: edit.goal,
      type: edit.type,
      typeStr: edit.typeStr,
      icon: edit.type === 0 ? "event" : edit.type === 1 ? "shopping-cart" : "assignment",
      price: edit.price,
      progress: 0,
      event: event,
      sale: sale,
      promotion: promotion,
    }, {new: true}, function(err, newCampaign){
      if(err) console.log(err);
      else {
        Campaign.find({owner: newCampaign.owner._id})
        .populate('ambassadors')
        .exec(function(err, resp){
          if(err) console.log(err);
          else socket.emit('new campaigns', resp);
        });
      }
    });
  });

  socket.on('delete campaign', function(campaign){
    console.log('delete campaign socket')
    Campaign.findByIdAndRemove(campaign._id, function(err, campaigns){
      if(err) console.log(err);
      else {
        console.log('campaign deleted');
        Campaign.find({owner: campaign.owner})
        .populate('ambassadors')
        .exec(function(err, resp){
          if(err) console.log(err);
          else {
            socket.emit('new campaigns', resp)
          }
        });
      }
    });
  });

  socket.on('get campaigns', function(owner){
    console.log('get campaigns socket')
    Campaign.find({owner: owner._id})
    .populate('ambassadors')
    .exec(function(err, resp){
      if(err) console.log(err);
      else socket.emit('found campaigns', resp)
    });
  });

  socket.on('get all campaigns', function(){
    console.log('get all campaigns socket')
    Campaign.find({})
    .populate('ambassadors')
    .exec(function(err, resp){
      if(err) console.log(err);
      else socket.emit('found all campaigns', resp)
    });
  });

  socket.on('edit owner profile', function(edit){
    console.log('edit owner profile socket')
    Owner.findByIdAndUpdate(edit._id, {
      firstName: edit.firstName,
      lastname: edit.lastName,
      email: edit.email,
      businessName: edit.businessName,
      businessDesc: edit.businessDesc,
      businessEmail: edit.businessEmail,
      businessAddress: edit.businessAddress,
      location: edit.location,
    }, {new: true}, function(err, oldProf){
      if(err) console.log(err);
      else {
        Owner.findById(edit._id, function(err, newProf){
          if(err) console.log(err);
          else socket.emit('new owner profile', newProf);
        })
      }
    });
  })

  socket.on('edit ambassador profile', function(edit){
    console.log('edit ambassador profile socket')
    Ambassador.findByIdAndUpdate(edit._id, {
      firstName: edit.firstName,
      lastname: edit.lastName,
      email: edit.email,
      address: edit.address,
      location: edit.location,
    }, {new: true}, function(err, oldProf){
      if(err) console.log(err);
      else {
        Ambassador.findById(oldProf._id)
        .populate('campaigns')
        .exec(function(err, newProf){
          if(err) console.log(err);
          else {
            socket.emit('new ambassador profile', newProf);
          }
        })
      }
    })
  })

  socket.on('join campaign', function(data){
    console.log('join campaign socket');
    if(data.ambassador.campaigns.indexOf(data.campaign._id) === -1) {
      data.ambassador.campaigns.push(data.campaign._id);
      Ambassador.findByIdAndUpdate(data.ambassador._id, data.ambassador,
        {new:true}, function(err, oldAmbassador){
          if(err) console.log(err);
          else console.log('ambassador updated')
        });
      } else console.log('campaign already in ambassador array')

      if(data.campaign.ambassadors.indexOf(data.ambassador._id) === -1) {
        data.campaign.ambassadors.push(data.ambassador._id);
        Campaign.findByIdAndUpdate(data.campaign._id, data.campaign,
          {new:true}, function(err, oldCampaign){
            if(err) console.log(err);
            else console.log('campaign updated')
          });
        } else console.log('ambassador already in campaign array')

        Collab.findOne({campaign: data.campaign._id, ambassador: data.ambassador._id})
        .then(function(err, oldCollab){
          if(err) console.log(err)
          if(oldCollab) {
            console.log('found old collab', oldCollab);
            socket.emit('joined campaign', {ambassador: data.ambassador, campaign: data.campaign, collab: oldCollab});
          } else {
            var newCollab = new Collab({
              ambassador: data.ambassador._id,
              campaign: data.campaign._id,
              checkins: [],
            });
            newCollab.save(function(err, newCollab){
              if(err) console.log(err)
              else {
                console.log('new collab saved');
                socket.emit('joined campaign', {ambassador:data.ambassador, campaign:data.campaign, collab: newCollab});
              }
            });
          }
        });
      });

        socket.on('leave campaign', function(data){
          console.log('leave campaign socket');
          Ambassador.findById(data.ambassador._id)
          .exec(function(err, ambassador){
            if(err) console.log(err);
            else {
              var newCampaigns = ambassador.campaigns;
              console.log(newCampaigns)
              newCampaigns.splice(newCampaigns.indexOf(data.campaign._id), 1);
              Ambassador.findByIdAndUpdate(data.ambassador._id, {campaigns: newCampaigns}, {new:true})
              .exec(function(err, resp){
                if(err) console.log(err);
                else console.log('ambassador updated')
              });
            }
          });

          Campaign.findById(data.campaign._id)
          .exec(function(err, campaign){
            if(err) console.log(err);
            else {
              var newAmbassadors = campaign.ambassadors;
              newAmbassadors.splice(newAmbassadors.indexOf(data.campaign._id), 1);
              Campaign.findByIdAndUpdate(data.campaign._id, {ambassadors: newAmbassadors}, {new: true})
              .exec(function(err, resp){
                  if(err) console.log(err);
                  else console.log('campaign updated')
              });
            }
          });

          Collab.findByIdAndRemove(data.token)
          .exec(function(err, resp){
            if(err) console.log(err)
            else console.log('collab removed')
          })

          Ambassador.findById(data.ambassador._id)
          .populate('campaigns')
          .exec(function(err, resp){
            if(err) console.log(err);
            else socket.emit('left campaign', {ambassador: resp});
          })
        });

            socket.on('populate campaigns', function(ambassador){
              console.log('populate campaigns socket');
              Ambassador.findById(ambassador._id)
              .populate('campaigns')
              .exec(function(err, resp){
                if(err) console.log(err);
                else {
                  socket.emit('populated campaigns', resp.campaigns);
                }
              });
            });

            socket.on('refresh', function(request){
              if(request.ambassador){
                console.log('refreshing ambassador');
                Ambassador.findById(request.ambassador)
                .populate('campaigns')
                .exec(function(err, ambassador){
                  if(err) console.log(err);
                  else {
                    console.log('refreshed ambassador', ambassador)
                    socket.emit('refreshed ambassador', ambassador)
                  }
                })
              }
              if(request.campaign){
                Campaign.findById(request.campaign)
                .populate('ambassadors')
                .exec(function(err, campaign){
                  if(err) console.log(err);
                  else socket.emit('refreshed campaign', campaign);
                });
              }
              if(request.owner){
                Owner.findById(request.owner)
                .exec(function(err, owner){
                  if(err) console.log(err);
                  else socket.emit('refreshed owner', owner);
                });
              }
            });

            socket.on('get collab', function(data){
              console.log('get collab socket');
              Collab.findOne({campaign: data.campaign._id, ambassador: data.ambassador._id})
              .populate('campaign')
              .populate('ambassador')
              .exec(function(err, resp){
                if(err) console.log(err)
                else {
                  socket.emit('found collab', resp);
                }
              })
            })


          });

          server.listen(port, function(){
            console.log('listening on ' + port);
          });
