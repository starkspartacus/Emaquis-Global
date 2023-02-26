const fs = require('fs');

exports.takeSocketAction = (socket, event) => {
  let files = {};
  let struct = {
    name: null,
    type: null,
    size: 0,
    data: [],
    slice: 0,
  };

  socket.on(event, (data) => {
    if (!files[data.name]) {
      files[data.name] = Object.assign({}, struct, data);
      files[data.name].data = [];
    }

    data.data = new Buffer.from(new Uint8Array(data.data));
    files[data.name].data.push(data.data);
    files[data.name].slice++;

    if (files[data.name].slice * 100000 >= files[data.name].size) {
      let fileBuffer = Buffer.concat(files[data.name].data);
      fs.writeFile('./public/admin/' + data.name, fileBuffer, (err) => {
        delete files[data.name];
        if (err) throw err;
      });

      socket.emit('end upload');
    } else {
      socket.emit('request slice upload', {
        currentSlice: files[data.name].slice,
      });
    }
  });
};
