const mongoose = require("mongoose")
const marked = require("marked")
const createDomPurify = require("dompurify")
const { JSDOM } = require("jsdom")
const dompurify = createDomPurify(new JSDOM().window)

const postSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    title : {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    sanitizedHtml: {
        type: String,
        required: true
    },
    comments: [{
        body: String
    }]
        
})

postSchema.pre('validate', function(next) {      
    if (this.markdown){
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    }
    next()
})

module.exports = mongoose.model('Posts', postSchema)
