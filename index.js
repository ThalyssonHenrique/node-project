const express = require('express')
const port = 3002
const server = express()
const uuid = require('uuid')

server.use(express.json())

const requests = []


//MIDDLEWARES

const checkOrderId = (request, response, next) => {

    const { id } = request.params
    const index = requests.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ error: 'user not found' })


    }

    request.orderIndex = index
    request.orderId = id

    next()
}


const checkUrl = (request, response, next) => {

    console.log(request.method)
    console.log(request.url)

    next()

}


//GET

server.get('/order', checkUrl, (request, response) => {

    return response.status(201).json(requests)
})


server.get('/order/:id', checkOrderId, checkUrl, (request, response) => {

    const index = request.orderIndex
    const id = request.orderId

    return response.status(201).json(requests[index])

})


//POST


server.post('/order', checkUrl, (request, response) => {

    const { order, clientName, price, status } = request.body
    const client = { id: uuid.v4(), order, clientName, price, status: "in preparation" }

    requests.push(client)

    return response.status(201).json(client)
})



//PUT



server.put('/order/:id', checkOrderId, checkUrl, (request, response) => {

    const { order, clientName, price, status } = request.body
    const index = request.orderIndex
    const id = request.orderId
    const updateOrder = { id, order, clientName, price, status: "in preparation" }

    requests[index] = updateOrder

    return response.status(201).json(updateOrder)

})


//PATCH


server.patch('/order/:id', checkOrderId, checkUrl, (request, response) => {

    const { order, clientName, price, status } = request.body
    const index = request.orderIndex
    const id = request.orderId
    const readyOrder = { id, order: requests[index].order, clientName: requests[index].clientName, price: requests[index].price, status: "ready" }

    requests[index] = readyOrder

    return response.status(201).json(readyOrder)
})


//DELETE


server.delete('/order/:id', checkOrderId, checkUrl, (request, response) => {

    const index = request.orderIndex

    requests.splice(index, 1)

    return response.json({requests})
})


server.listen(port, () => {
    console.log(`🚀 server started on port ${port}`)
})