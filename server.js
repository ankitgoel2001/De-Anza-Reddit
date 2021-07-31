const express = require("express")
const mongoose = require("mongoose")
const Posts = require("./models/database")
const postRouter = require("./routes/posts_route")
const methodOverride = require('method-override')
const app = express()

app.use(express.static(__dirname + '/public'))

mongoose.connect('mongodb://localhost/blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.set('view engine', 'ejs')



app.use(express.urlencoded({extended:false}))

app.use(methodOverride('_method'))

app.get('/', async(req,res) => {
    const posts = await Posts.find().sort({createdAt: "desc"})
    res.render('index', {posts: posts})
})


app.use('/posts', postRouter)

app.listen(1000)