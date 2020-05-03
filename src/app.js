const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
/*
  -- Formato de cada repositório
  { 
    id: "uuid", 
    title: 'Desafio Node.js', 
    url: 'http://github.com/...', 
    techs: ["Node.js", "..."], 
    likes: 0 
  }
*/

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {

  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  }

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  
  const { id } = request.params;
  const { title, url, techs } = request.body;
  
  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(400).json({error: "Repository not found."})
  } 

  repository.id = id;
  repository.title = title;
  repository.url = url;
  repository.techs = techs;
  
  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  } 

  const repository = repositories[repositoryIndex];

  repositories.splice(repositoryIndex,1);

  return response.status(204).send('');

});

app.post("/repositories/:id/like", (request, response) => {
  
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(400).json({ error: "Repository not found." });
  }

  repository.likes += 1;

  return response.json({
    likes: repository.likes
  });

});

module.exports = app;
