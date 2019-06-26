const express = require("express");

const server = express();

//Ler um JSON do corpo da requisição
server.use(express.json());

//Número de requisições feitas na aplicação
let numberOfReq = 0;

//Array de projetos
const projects = [];

//Middleware que Verifica se o projeto existe
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(project => project.id === id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }
  return next();
}

//Middleware global, conta quantas requisições foram feitas na aplicação
function logRequests(req, res, next) {
  numberOfReq++;
  console.log(`O número de requisições: ${numberOfReq}`);
  return next();
}

server.use(logRequests);

//Rota que lista todos os projetos
server.get("/projects", (req, res) => {
  return res.json(projects);
});

//Rota que cria projetos
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

//Rota que altera o titulo dos projetos pelo id da rota
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id === id);

  project.title = title;

  return res.json(project);
});

//Rota que deleta o projeto pelo seu id, presente na rota
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const IndexProjects = projects.find(project => project.id === id);

  projects.splice(IndexProjects, 1);

  return res.json(projects);
});

//Rota recebe um capo title e armazena dentro do array de tarefas (tasks)
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.params;

  const project = projects.find(project => project.id === id);

  project.tasks.push(title);

  return res.json(project);
});

//Servidor rodando na porta 3333
server.listen(3333);
