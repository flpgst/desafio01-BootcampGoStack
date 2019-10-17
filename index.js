const express = require('express')
const server = express()
server.use(express.json())

const projects = []
const stats = []
server.use((req, res, next) => {
    
    res.on('finish', () => {
        const event = `${req.method} ${req.originalUrl} ${res.statusCode}`
        stats[event] = stats[event] ? stats[event] + 1 : 1
        console.log(stats)
    })
    next()
})

server.use('/projects/:id', function (req, res, next) {
    const project = projects[req.params.id]
    const { id } = req.params
    if (!project) 
        return res.status(400).json({error: `Projeto ${id} não existe`})
    req.project = project
    next();
  });
  
server.post('/projects', (req, res) => {
    const {id, title, tasks} = req.body
    projects.push({id, title, tasks})
    return res.json(projects)
})

server.post('/projects/:id/tasks', (req, res) => {
    const { id } = req.params
    const { title } = req.body
    projects[id].tasks.push(title)
    return res.json(projects)
})

server.get('/projects', (req, res) => {
    return res.json(projects)
})

server.get('/projects/:id', (req, res) => {
    return res.json(req.project)
})

server.put('/projects/:id', (req, res) => {
    const { id } = req.params
    const { title } = req.body
    projects[id].title = title
    return res.json(projects)
})

server.delete('/projects/:id', (req, res) => {
    const { id } = req.params
    //delete projects[id] // o elemento nesta posição passa a ser null, o elemento não é excluido
    projects.splice(id, 1)
    return res.send()
})

server.listen(3000)