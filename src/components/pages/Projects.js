import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Message from "../layout/Message";
import styles from "./Projects.module.css";
import Container from "../layout/Container";
import LinkButton from "../layout/LinkButton";
import ProjectCard from "../project/ProjectCard";

import Loading from "../layout/Loading";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [projectMessage, setProjectMessage] = useState("")
  const [removeLoading, setRemoveLoading] = useState(false)

  const location = useLocation();
  let message = "";
  if (location.state) {
    message = location.state.message;
  }

  useEffect(() => {
    setTimeout(() =>{
      fetch("http://localhost:5000/projects", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
          setProjects(data);
          setRemoveLoading(true)
        })
        .catch((err) => console.log(err));
    }, 300)
  }, []);

  function removeProjects(id) {
    fetch(`http://localhost:5000/projects/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then(() => {
        setProjects(projects.filter((project) => project.id !== id));
        setProjectMessage("Projeto removido com sucesso!")
      })
      .catch((err) => console.log(err));
  }
  return (
    <div className={styles.project_container}>

      <div className={styles.title_container}>
        <h1>Meus Projetos</h1>
        <LinkButton to="/newproject" text="Novo Projeto" />
      </div>

      {message && <Message type="success" msg={message} />}
      {projectMessage && <Message type="success" msg={projectMessage} />}

      <Container customClass="start">
        {projects.length > 0 &&
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              budget={project.budget}
              name={project.name}
              category={project.category.name}
              handleRemove={removeProjects}
            />
          ))}
          {!removeLoading && <Loading/>}
          {removeLoading && projects.length === 0 && (
            <p>Não há projetos cadastrados</p>
          )}
      </Container>
    </div>
  );
}
export default Projects;
