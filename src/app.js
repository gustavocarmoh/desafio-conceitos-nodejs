const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4')

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repositorie ID.'});
  }

  return next();
}

app.get("/repositories", (request, response) => {

  const  { title, techs } =  request.query;
  
  const results = title
    ? repositories.filter(repo => repo.title.includes(title))
    : repositories;
  
  // results = techs
  //   ? results.filter(repo => repo.techs.includes(techs))
  //   : results;

  return response.json(results);

});

app.post("/repositories", (request, response) => {

  const { title, url, techs } = request.body;

  const repo = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repo);

  return response.json(repo);
});

app.put("/repositories/:id", validateProjectId, (request, response) => {
  // TODO

  const { id } = request.params;

  const { title, url, techs } = request.body;

  console.log(request.body)

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found.'});
  }

  const { likes } = repositories[repoIndex];

  const repo = {
    id,
    title,
    url,
    techs,
    likes,
  };

  console.log(repo)
  repositories[repoIndex] = repo;

  return response.status(200).json(repo);
});

app.delete("/repositories/:id", validateProjectId, (request, response) => {
  // TODO

  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found.'});
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateProjectId, (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repositire not found.'});
  }

  const { title, techs, likes } = repositories[repoIndex];

  const newLike = likes + 1;

  const repo = {
    id,
    title,
    techs,
    likes: newLike,
  };

  repositories[repoIndex] = repo;

  return response.status(200).json(repo);
});

module.exports = app;
