let clientesConectados = [];

const contarClientesConectados = (socket) => {
    clientesConectados.push(socket);
  socket.on("disconnect", () => {
    const index = clientesConectados.indexOf(socket);
    if (index !== -1) {
      clientesConectados.splice(index, 1);
    }
  });
};

const conectados = (req = express.request, res = express.response) => {
  const clientes = clientesConectados.length;
  res.json({
    clientes: clientes,
  });
};


module.exports={
    conectados,
    contarClientesConectados,
    clientesConectados
}
