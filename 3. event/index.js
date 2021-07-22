import events from "events";

const eventEmitter = new events.EventEmitter();

eventEmitter.on('connection', () => {
    console.log("connect event");
    eventEmitter.emit("receive_data");
});

eventEmitter.on('receive_data', () => {
    console.log("data receive");
})

eventEmitter.emit('connection');
console.log("program end");