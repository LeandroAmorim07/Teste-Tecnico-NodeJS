const clientsDB = require('../database/clients.db');
const xlsx = require('xlsx');
const fs = require('fs');

class ClientsService {

    static getAllClients() { //  use this method to get all clients from the database
        return clientsDB;
    }

    static getClientById(id) { //  use this method to get a client by id from the database
        return clientsDB.find(client => client.id === id);
    }

    static createClient(name, email) { //  use this method to create a new client in the database
        const newClient = { id: clientsDB.length + 1, name, email };
        clientsDB.push(newClient);
        return newClient;
    }

    static deleteClient(id) { //  use this method to delete a client by id from the database
        const index = clientsDB.findIndex(client => client.id === id);
        if (index !== -1) {
            return clientsDB.splice(index, 1)[0];
        }
        return null;
    }

    static updateClient(id, name, email) { //  use this method to update a client by id from the database
        const client = clientsDB.find(client => client.id === id);
        if (!client) return null;
        
        client.name = name || client.name;
        client.email = email || client.email;
    
        return client;
    }
    
   

static importClientsFromExcel(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    data.forEach(client => {
        if (client.name && client.email) {
            clientsDB.push({
                id: clientsDB.length + 1,
                name: client.name,
                email: client.email
            });
        }
    });

    fs.unlinkSync(filePath); // Delete file after processing
    return data;
    }

}

module.exports = ClientsService; // We export the ClientsService class to be used in other files