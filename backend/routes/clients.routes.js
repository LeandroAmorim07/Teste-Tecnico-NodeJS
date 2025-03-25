const express = require('express');
const router = express.Router();
const ClientsService = require('../services/clients.service');

// Get all clients
router.get('/', (req, res) => {
    res.json(ClientsService.getAllClients());
});

// Get client by ID
router.get('/:id', (req, res) => {
    const client = ClientsService.getClientById(parseInt(req.params.id));
    if (!client) {
        return res.status(404).json({ error: "Client not found" });
    }
    res.json(client);
});

// Create a new client
router.post('/', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required!" });
    }
    const newClient = ClientsService.createClient(name, email);
    res.status(201).json(newClient);
});

// Delete a client
router.delete('/:id', (req, res) => {
    const deletedClient = ClientsService.deleteClient(parseInt(req.params.id));
    if (!deletedClient) {
        return res.status(404).json({ error: "Client not found" });
    }
    res.json({ message: "Client deleted successfully", client: deletedClient });
});

router.put('/:id', (req, res) => { // Update a client by a given ID
    const { name, email } = req.body;
    const updatedClient = ClientsService.updateClient(parseInt(req.params.id), name, email);
    
    if (!updatedClient) {
        return res.status(404).json({ error: "Client not found" });
    }

    res.json({ message: "Client updated successfully", client: updatedClient });
});

const upload = require('../middlewares/upload.middlewares');


 // Import clients from Excel file
router.post('/import', upload.single('file'), (req, res) => { 
    if (!req.file) {
        return res.status(400).json({ error: "No file upload" });
    }

    const importedClients = ClientsService.importClientsFromExcel(req.file.path);
    res.json({ message: "Clients imported successfully", clients: importedClients });
});


module.exports = router;
