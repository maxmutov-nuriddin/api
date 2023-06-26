import { useState, useEffect } from "react";
import { MdOutlineFavoriteBorder } from 'react-icons/md'
import { FaRegCommentDots } from 'react-icons/fa'
import { AiOutlineDelete, AiFillEdit } from 'react-icons/ai'

import {  NavLink } from 'react-router-dom';


function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage, setTasksPerPage] = useState(10);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/todos");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchTasks();
  }, []);

  function handleToggleTaskStatus(taskId) {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          completed: !task.completed
        }
      }
      return task;
    });

    if (sortBy === "default") {
      setTasks(updatedTasks.sort((a, b) => a.completed - b.completed));
    } else {
      setTasks(updatedTasks);
    }
  }

  async function handleDeleteTask(taskId) {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
        method: 'DELETE'
      });
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAddTask(taskTitle) {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos`, {
        method: 'POST',
        body: JSON.stringify({
          title: taskTitle,
          completed: false
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error(error);
    }
  }

  function handleEditClick(taskId) {
    console.log(`Edit clicked for task with ID ${taskId}`);
  }

  function handleSelectAllTasks(event) {
    const isChecked = event.target.checked;
    const updatedTasks = tasks.map(task => {
      return {
        ...task,
        selected: isChecked
      }
    });
    setTasks(updatedTasks);
  }

  function handleSelectTask(event, taskId) {
    const isChecked = event.target.checked;
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          selected: isChecked
        }
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  async function handleDeleteSelectedTasks() {
    const selectedTaskIds = tasks.filter(task => task.selected).map(task => task.id);
    try {
      await Promise.all(selectedTaskIds.map(taskId => {
        return fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
          method: 'DELETE'
        });
      }));
      setTasks(tasks.filter(task => !task.selected));
    } catch (error) {
      console.error(error);
    }
  }

  function handleFilterChange(event) {
    setFilter(event.target.value);
  }

  function handleSortByChange(event) {
    setSortBy(event.target.value);
    if (event.target.value === "default") {
      setTasks(tasks.sort((a, b) => a.completed - b.completed));
    } else if (event.target.value === "title") {
      setTasks(tasks.sort((a, b) => a.title.localeCompare(b.title)));
    }
  }

  function handlePageChange(event) {
    setCurrentPage(Number(event.target.value));
  }

  function handleTasksPerPageChange(event) {
    setTasksPerPage(Number(event.target.value));
    setCurrentPage(1);
  }

  const filteredTasks = tasks.filter(task => {
    return task.title.toLowerCase().includes(filter.toLowerCase());
  });

  const sortedTasks = sortBy === "default" ? filteredTasks.sort((a, b) => a.completed - b.completed) : sortBy === "title" ? filteredTasks.sort((a, b) => a.title.localeCompare(b.title)) : filteredTasks;

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = sortedTasks.slice(indexOfFirstTask, indexOfLastTask);

  return (
    <div className="container">
      <NavLink className='li d-flex' to="/Album.jsx">Album</NavLink>
      <NavLink className='li d-flex' to="/">Comment</NavLink>
      <div className="row">
        <div className="col-12">
          <h1>Todo List</h1>
          <div className="row mb-3">
            <div className="col-md-6">
              <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addTaskModal">Add Task</button>
              <button className="btn btn-danger ms-2" onClick={handleDeleteSelectedTasks} disabled={!tasks.some(task => task.selected)}>Delete Selected</button>
            </div>
            <div className="col-md-6">
              <div className="d-flex">
                <div className="form-group me-2">
                  <label htmlFor="filterInput">Filter:</label>
                  <input type="text" className="form-control" id="filterInput" value={filter} onChange={handleFilterChange} />
                </div>
                <div className="form-group me-2">
                  <label htmlFor="sortBySelect">Sort By:</label>
                  <select className="form-control" id="sortBySelect" value={sortBy} onChange={handleSortByChange}>
                    <option value="default">Default</option>
                    <option value="title">Title</option>
                  </select>
                </div>
                <div className="form-group me-2">
                  <label htmlFor="tasksPerPageSelect">Tasks Per Page:</label>
                  <select className="form-control" id="tasksPerPageSelect" value={tasksPerPage} onChange={handleTasksPerPageChange}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="selectAllCheckbox" onChange={handleSelectAllTasks} />
                    <label className="form-check-label" htmlFor="selectAllCheckbox">
                      Select All
                    </label>
                  </div>
                </th>
                <th>Title</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.map(task => (
                <tr key={task.id}>
                  <td>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id={`selectCheckbox-${task.id}`} checked={task.selected} onChange={event => handleSelectTask(event, task.id)} />
                    </div>
                  </td>
                  <td>{task.title}</td>
                  <td>
                    {task.completed ? (
                      <MdOutlineFavoriteBorder className="text-success" />
                    ) : (
                      <FaRegCommentDots className="text-warning" />
                    )}
                  </td>
                  <td>
                    <button className="btn btn-primary me-2" onClick={() => handleEditClick(task.id)}><AiFillEdit /></button>
                    <button className="btn btn-danger" onClick={() => handleDeleteTask(task.id)}><AiOutlineDelete /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <nav>
            <ul className="pagination">
              {Array(Math.ceil(sortedTasks.length / tasksPerPage)).fill().map((_, index) => (
                <li className={`page-item ${currentPage === index + 1 ? "active" : ""}`} key={index}>
                  <button className="page-link" value={index + 1} onClick={handlePageChange}>{index + 1}</button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <div className="modal fade" id="addTaskModal" tabIndex="-1" aria-labelledby="addTaskModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addTaskModalLabel">Add Task</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="taskTitleInput">Title:</label>
                <input type="text" className="form-control" id="taskTitleInput" />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={() => handleAddTask(document.getElementById("taskTitleInput").value)} data-bs-dismiss="modal">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TodoList;