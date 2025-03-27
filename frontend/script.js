const apiUrl = "http://localhost:3000/clientes"; 

document.addEventListener("DOMContentLoaded", () => {
    loadClients();
    document.getElementById("clientForm").addEventListener("submit", saveClient);
    document.getElementById("importForm").addEventListener("submit", importClients);
});

// Listar os clientes
function loadClients() {
    fetch(apiUrl)
        .then((response) => response.json())
        .then((clients) => {
            const tbody = document.getElementById("clientTableBody");
            tbody.innerHTML = ""; // Limpa a tabela antes de preencher

            clients.forEach((client) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${client.id}</td>
                    <td>${client.name}</td>
                    <td>${client.email}</td>
                    <td>
                        <button class="edit-btn" onclick="editClient(${client.id}, '${client.name}', '${client.email}')">Editar</button>
                        <button class="delete-btn" onclick="deleteClient(${client.id})">Excluir</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch((error) => console.error("Erro ao carregar clientes:", error));
}
// Salvar (Criar ou Atualizar) Cliente
function saveClient(event) {
    event.preventDefault();

    const id = document.getElementById("clientId").value.trim(); // Pega o ID (se existir)
    const name = document.getElementById("clientName").value;
    const email = document.getElementById("clientEmail").value;

    const method = id ? "PUT" : "POST";
    const url = id ? `${apiUrl}/${id}` : apiUrl;

    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
    })
    .then((response) => response.json())
    .then(() => {
        loadClients();
        document.getElementById("clientForm").reset(); // Limpar o formulário
        document.getElementById("clientId").value = ""; // Resetar o campo ID para evitar edição contínua
    })
    .catch((error) => console.error("Erro ao salvar cliente:", error));
}

// Preencher o formulário para edição
function editClient(id, name, email) {
    document.getElementById("clientId").value = id; // Define o ID para edição
    document.getElementById("clientName").value = name;
    document.getElementById("clientEmail").value = email;
}


// Excluir cliente
function deleteClient(id) {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
        fetch(`${apiUrl}/${id}`, { method: "DELETE" })
            .then((response) => response.json())
            .then(() => loadClients())
            .catch((error) => console.error("Erro ao excluir cliente:", error));
    }
}

// Importar Clientes via Excel
function importClients(event) {
    event.preventDefault();

    const fileInput = document.getElementById("excelFile");
    if (!fileInput.files.length) {
        alert("Selecione um arquivo Excel primeiro!");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    fetch(`${apiUrl}/import`, {
        method: "POST",
        body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
        alert(data.message);
        loadClients(); // Atualiza a tabela depois da importação
        fileInput.value = ""; // Limpa o campo de upload
    })
    .catch((error) => console.error("Erro ao importar clientes:", error));
}
