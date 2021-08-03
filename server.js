const cluster = require('cluster')
const os = require('os')
const cpuCount = os.cpus().length

const app = require('./app')

// Cluster Management
if (cluster.isMaster) {
    for (let i = 0; i < cpuCount; i++)
        cluster.fork()

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} exited, Code ${code}, Signal ${signal}`)
        cluster.fork()
    })
}
else {
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
        console.log(`Listening on PORT ${port}`)
    })
}