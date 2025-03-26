const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');


const clientsDBPath = path.join(__dirname, '../database/clients.db.js');


function readClientsDB() {
  
    if (fs.existsSync(clientsDBPath)) {
        const data = require(clientsDBPath);  
        return data;
    }
    return []; 
}


function saveClientsDB(clients) {
    
    const content = `module.exports = ${JSON.stringify(clients, null, 2)};`;

    fs.writeFileSync(clientsDBPath, content);  
}

class ClientsService {
    static getAllClients() {
        return readClientsDB();  
    }

    static getClientById(id) {
        const clientsDB = readClientsDB();
        return clientsDB.find(client => client.id === id);
    }

    static createClient(name, email) {
        const clientsDB = readClientsDB();
        
        // tenho que encontrar o maior id existente e somar 1 pra ser incremental
        const maxId = clientsDB.reduce((max, client) => Math.max(max, client.id), 0);
        const newClient = { id: maxId + 1, name, email };
        
        clientsDB.push(newClient);
        saveClientsDB(clientsDB);  
        return newClient;
    }
    
    static deleteClient(id) {
        const clientsDB = readClientsDB();
        const index = clientsDB.findIndex(client => client.id === id);
        if (index !== -1) {
            const deletedClient = clientsDB.splice(index, 1)[0];
            saveClientsDB(clientsDB);  
            return deletedClient;
        }
        return null;
    }

    static updateClient(id, name, email) {
        const clientsDB = readClientsDB();
        const client = clientsDB.find(client => client.id === id);
        if (!client) return null;

        client.name = name || client.name;
        client.email = email || client.email;
        saveClientsDB(clientsDB);  
        return client;
    }

    static importClientsFromExcel(filePath) {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
        let clientsDB = readClientsDB(); 
    
        
        data.forEach(client => {
            if (client.Name && client.Email) {
                
                const newId = clientsDB.length ? Math.max(...clientsDB.map(c => c.id)) + 1 : 1;
                clientsDB.push({
                    id: newId,
                    name: client.Name,
                    email: client.Email
                });
            }
        });
    
        saveClientsDB(clientsDB);
    
        fs.unlinkSync(filePath); 
        return data;
    }
}

module.exports = ClientsService;
