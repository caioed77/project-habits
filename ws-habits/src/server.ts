import cors from '@fastify/cors'
import Fastify from 'fastify'
import { appRoutes } from './lib/routes'


const app = Fastify()
app.register(cors)
app.register(appRoutes)

app.listen({
    port: 3333
}).then(()=> {
    console.log('HTTP Server running')
})