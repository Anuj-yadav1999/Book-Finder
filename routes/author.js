const express = require('express')
const router = express.Router()
const Author = require('../models/author')

//Get all authors
router.get('/', async (req, res) => {
    let author = {}
    if(req.query.name != null && req.query.name != ''){
        author.name = new RegExp(req.query.name, 'i')
    }
    try{
        const authors = await Author.find(author)
        res.render('authors/index', {
            author: req.query,
            authors: authors
        })
    } catch {
        res.redirect('/', {
            errorMessage: "Cannot Find Author"
        })
    }
})

//Add author
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author })
})

//Create author
router.post('/', async (req, res) => {
    let author = new Author({
        name: req.body.name
    })
    try{
        await author.save()
        res.render('authors/new', {
            author: req.body,
            errorMessage: "Successfully created author"
        })
    } catch {
        res.redirect('/', {
            errorMessage: "Error Creating author"
        })
    }
})

//Show Author
router.get('/:id', (req, res) => {
    res.send('Show Author ' + req.params.id)
})

//Edit author
router.get('/:id/edit', async (req, res) => {
    try{
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', {author: author})
    } catch {
        res.redirect('/authors')
    }
})

//update author
router.put('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    } catch  {
        if(author != null){
            res.redirect('/')
        } else {
            res.render('author/edit', {
                author: author,
                errorMessage: 'Error updating author'
            })
        }
    }
})

//Delete author
router.delete('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect('/authors')
    } catch (error) {
        if(author != null){
            res.redirect('/')
        } else {
            res.redirect(`/authors/${author.id}`)
        }
    }
})

module.exports = router