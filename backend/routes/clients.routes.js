const express = require('express');
const router = express.Router();
const ClientsService = require('../services/clients.service');

// pegar todos os clientes
router.get('/', (req, res) => {
    res.json(ClientsService.getAllClients());
});

// pegar um cliente pelo id 
router.get('/:id', (req, res) => {
    const client = ClientsService.getClientById(parseInt(req.params.id));
    if (!client) {
        return res.status(404).json({ error: "Cliente não encontrado" });
    }
    res.json(client);
});

// Criar um cliente
router.post('/', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: "Nome e Email são necessários" });
    }
    const newClient = ClientsService.createClient(name, email);
    res.status(201).json(newClient);
});

// Delete um cliente
router.delete('/:id', (req, res) => {
    const deletedClient = ClientsService.deleteClient(parseInt(req.params.id));
    if (!deletedClient) {
        return res.status(404).json({ error: "Client não encontrado" });
    }
    res.json({ message: "Cliente deletado com Sucesso", client: deletedClient });
});




// Atualizar um cliente
router.put('/:id', (req, res) => { 
    const { name, email } = req.body;
    const updatedClient = ClientsService.updateClient(parseInt(req.params.id), name, email);
    
    if (!updatedClient) {
        return res.status(404).json({ error: "Cliente não encontrado" });
    }

    res.json({ message: "Clientes atualizados com sucesso", client: updatedClient });
});

const upload = require('../middlewares/upload.middlewares');
const clientsDB = require('../database/clients.db');


 // Importar clientes de um arquivo excel
router.post('/import', upload.single('file'), (req, res) => { 
    if (!req.file) {
        return res.status(400).json({ error: "No file upload" });
    }

    const importedClients = ClientsService.importClientsFromExcel(req.file.path);
    res.json({ message: "Clientes importados com sucesso", clients: importedClients });
    
    console.log(clientsDB);
});


module.exports = router;
