const { Worker, workerData, isMainThread } = require('worker_threads')

if (isMainThread) {
    console.log(`Main thread pid: ${process.pid}`)
    new Worker(__filename, {
        workerData: [3,5,6,7,8]
    }); // threads.js
    new Worker(__filename, {
        workerData: [3,5,6,8,1]
    }); // threads.js
} else {
    console.log(`Worker thread pid: ${process.pid}`)
    console.log(`${workerData} is sorted ${workerData.sort()}`)
}
