import express from "express";
import cors from 'cors';

const app = express(); //cria uma instância para usarmos o express
const port = 5000; //criamos uma porta para que o servidor fique conectado ao usarmos ele

//As tarefas devem vir na forma de objeto contendo:
//exemplo de tarefa
const primeiraTarefa = {
    id: 1,
    nome: "Estudar para a prova",
    proprietario: "joão pessoa",
    dataInicio: "2023-10-28",
    dataTermino: "2023-11-19"
}

let tarefas = [primeiraTarefa];

app.use(express.json()); //garante que possamos converter json quando enviarmos para o servidor
app.use(cors()); // garante que não teremos problemas de cors no envio de nossas requisições

app.listen(port, () => {
    console.log(`Servidor está conectado na porta ${port}`)
}); // esse código conecta a porta ao nosso servidor. Agora, podemos fazer requisições para este app usando a porta 5000

//Vamos criar uma tarefa através de um método post. 
//Request significa requisição e podemos usar esse método para mandar coisas para o nosso servidor
//Já response significa resposta e podemos usar ele para mandar respostas para quem está se comunicando com o nosso servidor.

app.post('/criarTarefa', (request, response) => {
    let tarefa = request.body; //pegamos a tarefa que alguém no enviou
    if(tarefa.nome !== undefined && tarefa.proprietario !== undefined && tarefa.dataInicio !== undefined && tarefa.dataTermino !== undefined){
        if(tarefa.nome === '' || tarefa.proprietario === '') {
            response.status(400).send("Todos os campos são obrigatórios");
        }else{
            tarefas.push(tarefa);
            response.status(200).send(tarefa)
        }
    }else{
        response.sendStatus(400)
    }
});

//vamos criar uma requisição para pegar todas as tarefas criadas até então

app.get("/pegarTarefas", (request, response) => {
    response.send(tarefas)
});

//vamos criar um metodo para pegar uma tarefa específica com base no que nos é passado no código, no caso o nome do proprietário

app.get("/pegarTarefas/:proprietario", (request, response) => {
    const proprietario = request.params.proprietario;
    const tarefasDoProprietario = tarefas.filter(tarefa => {
        if(tarefa.proprietario === proprietario) {
            return tarefa
        }
    });
    response.status(201).send(tarefasDoProprietario);
});

app.get("/pegarTarefa/:id", (request, response) => {
    const id = request.params.id;
    const tarefaEcontrada = tarefas.filter(tarefa => {
        if(tarefa.id == id) {
            return tarefa
        }
    })
    if(tarefaEcontrada) {
        response.status(201).send(tarefaEcontrada)
    }else{
        response.status(404)
    }
})


//Vamos criar um método para editar uma tarefa específica com base no que nos é passado no código, no caso o id da tarefa

app.put("/editarTarefa/:id", (request, response) => {
    const id = request.params.id;
    const novaTarefa = request.body;

    // Use o método map para criar uma nova lista de tarefas com a tarefa atualizada
    const tarefasAtualizadas = tarefas.map(tarefa => {
        if (tarefa.id == id) {
            // Atualize a tarefa com base no ID
            return novaTarefa;
        } else {
            return tarefa;
        }
    });

    // Atualize a lista original de tarefas com as tarefas atualizadas
    tarefas = tarefasAtualizadas;

    response.status(200).send(tarefas);
});

//vamos cirar um método para deletar uma tarefa da lista com base no id

app.delete("/deletarTarefa/:id", (request, response) => {
    const id = request.params.id;
    const indiceParaExcluir = tarefas.findIndex(item => item.id == id);

    // Se o índice for encontrado, remova o item da lista
    if (indiceParaExcluir !== -1) {
        tarefas.splice(indiceParaExcluir, 1);
        response.status(200).send("Tarefa excluída com sucesso.");
    } else {
        response.status(404).send("Tarefa não encontrada.");
    }
});
