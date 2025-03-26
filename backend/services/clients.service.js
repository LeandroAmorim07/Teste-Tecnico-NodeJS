const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

// Caminho para o arquivo `clientsDB.js`
const clientsDBPath = path.join(__dirname, '../database/clients.db.js');

// Função para ler o arquivo de clientes
function readClientsDB() {
    // Lê o arquivo e executa o código JavaScript nele (como um módulo)
    if (fs.existsSync(clientsDBPath)) {
        const data = require(clientsDBPath);  // Requer o arquivo para obter os dados em tempo de execução
        return data;
    }
    return []; // Retorna um array vazio se o arquivo não existir
}

// Função para salvar os dados no arquivo `clientsDB.js`
function saveClientsDB(clients) {
    // Cria o código JavaScript para salvar os dados como um array
    const content = `module.exports = ${JSON.stringify(clients, null, 2)};`;

    fs.writeFileSync(clientsDBPath, content);  // Escreve o conteúdo no arquivo
}

class ClientsService {
    static getAllClients() {
        return readClientsDB();  // Lê os dados do arquivo
    }

    static getClientById(id) {
        const clientsDB = readClientsDB();
        return clientsDB.find(client => client.id === id);
    }

    static createClient(name, email) {
        const clientsDB = readClientsDB();
        const newClient = { id: clientsDB.length + 1, name, email };
        clientsDB.push(newClient);
        saveClientsDB(clientsDB);  // Atualiza o arquivo
        return newClient;
    }

    static deleteClient(id) {
        const clientsDB = readClientsDB();
        const index = clientsDB.findIndex(client => client.id === id);
        if (index !== -1) {
            const deletedClient = clientsDB.splice(index, 1)[0];
            saveClientsDB(clientsDB);  // Atualiza o arquivo
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
        saveClientsDB(clientsDB);  // Atualiza o arquivo
        return client;
    }

    static importClientsFromExcel(filePath) {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
        let clientsDB = readClientsDB();  // Lê os dados atuais do arquivo
    
        // Adiciona os novos clientes ao banco de dados existente
        data.forEach(client => {
            if (client.Name && client.Email) {
                // Gera um novo id baseado no maior id existente
                const newId = clientsDB.length ? Math.max(...clientsDB.map(c => c.id)) + 1 : 1;
                clientsDB.push({
                    id: newId,
                    name: client.Name,
                    email: client.Email
                });
            }
        });
    
        // Salva os dados atualizados no arquivo
        saveClientsDB(clientsDB);
    
        fs.unlinkSync(filePath);  // Exclui o arquivo após processar
        return data;
    }
}

module.exports = ClientsService;
