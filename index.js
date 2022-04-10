import server from './server/server.js'

const { PORT = '8000' } = process.env

server.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`)
})
