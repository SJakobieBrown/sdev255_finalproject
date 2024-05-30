const express = require('express');
const mongoose = require('mongoose');
const courseRoutes = require('./routes/courseRoutes')
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser');
const { checkUser } = require('./middleware/authMiddleware');
//express app
const app = express();

const dbURI = 'mongodb+srv://Group2User:Group2Password@nodetut.cuis5bu.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result)=> app.listen(3000))
  .catch((err)=> console.log(err));

//register view engine
app.set('view engine', 'ejs')

//middleware and static files
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());


//Standard Routes
app.get('*', checkUser)
app.get('/', (req, res) => {
    res.redirect('/courses')
  });

app.get('/about', (req, res) => {
    res.render('about', { title: 'About'});
});

// course routes
app.use('/courses', courseRoutes);

// auth routes
app.use('/auths', authRoutes);

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404'});
});