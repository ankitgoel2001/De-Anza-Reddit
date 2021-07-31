const express = require("express")
const Posts = require("./../models/database")
const router = express.Router()

router.get('/new', (req, res) =>{
    res.render('newPost', {posts: new Posts()})
})

router.get('/edit/:id', async(req, res) =>{
    const posts = await Posts.findById(req.params.id)
    res.render('edit', {posts: posts})

})

router.get('/:id', async(req, res) => {//change slug
    const posts = await Posts.findById(req.params.id) //changed slug
    if (posts == null) res.redirect('/')
    res.render('show', {posts: posts})
})

router.post('/:id', async(req, res) =>{
    req.posts = await Posts.findById(req.params.id)
    req.posts.comments.push({'body': req.body.comments})
    req.posts.save()
    res.redirect(`/posts/${req.posts._id}`)
})

router.post('/', async(req, res, next) => {
    req.posts = new Posts()
    next()
}, savePostAndRedirect('newPost'))

router.put('/:id', async(req,res, next) => {
    req.posts = await Posts.findById(req.params.id)
    next()
}, savePostAndRedirect('edit'))

router.post('/delete/:id', async(req, res) => {
    await Posts.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

function savePostAndRedirect(path){
    return async(req,res) => {
        let posts = req.posts 
         posts.name = req.body.name
         posts.description = req.body.description
         posts.markdown = req.body.markdown
         posts.title = req.body.title
        try{
            posts = await posts.save()
            res.redirect(`/posts/${posts._id}`)
        } catch (e) {
            console.log(e)
            res.render(`${path}`, {posts: posts})
        }
    }
}

module.exports = router