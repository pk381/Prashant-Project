const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');

const app = express();

// routes
const userRoute = require('./routes/user');
const mainRoute = require('./routes/main');
const pageRoute = require('./routes/page');
const adminRoute = require('./routes/admin');


// // database tables
// const User = require('./models/user');

// static files
app.use(express.static(path.join(__dirname, "public")));

// body parser in json
app.use(bodyParser.json());

// serving routes
app.use('/user', userRoute);
app.use('/main', mainRoute);
app.use('/page', pageRoute);
app.use('/admin', adminRoute);


app.get('/', (req, res, next)=>{
    res.redirect('/user/sign_up');
});


// table relations

// syncing database
sequelize.sync()
.then(res=>{

    app.listen(4000);

}).catch(err=>{
    console.log(err);
})

