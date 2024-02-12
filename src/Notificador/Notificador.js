class Notificador {
    constructor(router) {
      this.router = router;
      this.resClients = [];
      this.solicitarNotificacion();
    }
  
    solicitarNotificacion() {
      // Cambié "res" y "req" por "req" y "res" respectivamente para seguir el orden comúnmente usado en Express
      this.router.get("/notificacion", (req, res) => {
        this.resClients.push(res);
     
      });
    }
  
    responderClientes(mensaje) {
      this.resClients.forEach((cliente) => {
        console.log("enviando...")
        cliente.send({ mensaje }); // Usé json en lugar de send para enviar objetos JSON
      });

      this.resClients = [];
    }
  }
  
  module.exports = Notificador;
  