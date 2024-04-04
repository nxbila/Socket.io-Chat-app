//Node server which will handle all Socket.io connections

const io = require('socket.io')(8000, {
    cors: {
      origin: '*',
    }
  });


const users = {}

//On getting a connection run this arrow function
io.on('connection', socket => {
    //whenever a user joins, take the name and run the callback fn
    //new-user-joined is an event. It is a custom event.
    socket.on('new-user-joined',name => {
        users[socket.id] = name; // the name will be appended inside users.
        //When a new user joins, it is broadcast to all other users
        console.log('New user', name);
        socket.broadcast.emit('user-joined', name); //It also gives the name of the user joined
    })
    //When a user sends a chat message, this event will be run
    socket.on('send', message => {
        socket.broadcast.emit('receive', {message:message, name:users[socket.id]})
    });
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    })

})