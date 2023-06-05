import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/style.css';

function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [newTodoDate, setNewTodoDate] = useState('');
  const [updateTodoId, setUpdateTodoId] = useState('');
  const [updateTodoText, setUpdateTodoText] = useState('');
  const [updateTodoDate, setUpdateTodoDate] = useState('');
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogout = () => {
    // Clear the local storage
    localStorage.clear();

    // Set the user to logged out
    setIsLoggedIn(false);

    // Navigate to the login page
    navigate('/loginNew');
  };

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('user'));
    if (items) {
      setItems(items);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [items]);

  const fetchTodos = async () => {
    const response = await axios.get(`http://localhost:8081/todos?userId=${items.id}`);
    setTodos(response.data);
  };

  const addTodo = async () => {
    if (newTodo.trim() !== '' && newTodoDate.trim() !== '') {
      const formattedDate = newTodoDate;
      const trimmedDate = formattedDate.split(' ')[0];

      const response = await axios.post('http://localhost:8081/todos', {
        title: newTodo,
        completed: false,
        date: trimmedDate,
        userId: items.id,
      });

      if (response.status === 201) {
        const newTodoId = response.data.id;
        setTodos([...todos, { id: newTodoId, title: newTodo, completed: false, date: trimmedDate }]);
        setNewTodo('');
        setNewTodoDate('');
      }
    }
  };

  const updateTodo = async (id, completed, title, date) => {
    const updatedCompleted = !completed;
    const response = await axios.put(`http://localhost:8081/updateTodos?Id=${id}`, {
      completed: updatedCompleted,
      title: title,
      date: date,
      todoId: id,
    });

    if (response.status === 200) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? { ...todo, completed: updatedCompleted } : todo))
      );
    }
  };

  const deleteTodo = async (id) => {
    const response = await axios.delete(`http://localhost:8081/deleteTodos?id=${id}`);
    if (response.status === 200) {
      fetchTodos();
    }
  };

  const handleTodoChange = (event) => {
    setNewTodo(event.target.value);
  };

  const handleTodoDateChange = (event) => {
    setNewTodoDate(event.target.value);
  };

  const openUpdateTodoForm = (id, title, date) => {
    setUpdateTodoId(id);
    setUpdateTodoText(title);
    setUpdateTodoDate(date);
  };

  const cancelUpdateTodo = () => {
    setUpdateTodoId('');
    setUpdateTodoText('');
    setUpdateTodoDate('');
  };

  const saveUpdatedTodo = async () => {
    if (updateTodoText.trim() !== '' && updateTodoDate.trim() !== '') {
      const response = await axios.put(`http://localhost:8081/updateTodos?Id=${updateTodoId}`, {
        title: updateTodoText,
        date: updateTodoDate,
      });
      if (response.status === 200) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === updateTodoId ? { ...todo, title: updateTodoText, date: updateTodoDate } : todo
          )
        );
        setUpdateTodoId('');
        setUpdateTodoText('');
        setUpdateTodoDate('');
      }
    }
  };

  const handleUpdateInputDateChange = () => {
    console.log('hello world');
  };

  const handleUpdateInputChange = (e) => {
    if (e.target.value) {
      setUpdateTodoText(e.target.value);
    } else {
      setUpdateTodoText('');
    }
  };

  return (
    <div>
      <nav>
        <span>Welcome, {items.name}</span>
        <button onClick={handleLogout}>Logout</button>
      </nav>
      <div className="App">
        <h1>Todo List</h1>
        <div className="todo-form">
          <input type="text" value={newTodo} onChange={handleTodoChange} placeholder="Todo" />
          <input type="date" value={newTodoDate} onChange={handleTodoDateChange} />
          <br/><br/>
          <button onClick={addTodo}>Add Todo</button>
        </div>
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => updateTodo(todo.id, todo.completed, todo.title, todo.date)}
              />
              {todo.id === updateTodoId ? (
                <>
                  <input type="text" value={updateTodoText} onChange={handleUpdateInputChange} />
                  {/* <input type="date" value={updateTodoDate} onChange={handleUpdateInputDateChange} /> */}
                  <button className="save-btn" onClick={saveUpdatedTodo}>
                    Save
                  </button>
                  <button className="cancel-btn" onClick={cancelUpdateTodo}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className={todo.completed ? 'completed' : ''}>{todo.title}</span>
                  <span>{new Date(todo.date).toLocaleDateString()}</span>
                  <button className="update-btn" onClick={() => openUpdateTodoForm(todo.id, todo.title, todo.date)}>
                    Update
                  </button>
                </>
              )}
              <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TodoPage;
