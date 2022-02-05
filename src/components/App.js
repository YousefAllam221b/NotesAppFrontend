import React from 'react';
import ReactDOM from 'react-dom';
import LoginButton from './LoginButton';
import NoteCard from './NoteCard';
import AddNoteButton from './AddNoteButton';
class App extends React.Component {
  state = {notes: [

  ]}
  prevId = 0;

  handleNoteUpdate = async(index, updatedText) => {
    console.log(index);
    this.state.notes[index].value = updatedText
    this.forceUpdate()
    const response = await fetch(`http://localhost:5000/update/:${index}/:${updatedText}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  handleAddNote = async(title) => {
      this.setState( prevState => {
        return {
          notes: [
            ...prevState.notes,
            {
              value: '',
              title,
              id: this.prevId +=1
            }
          ]
        };
      });
      const response = await fetch(`http://localhost:5000/addNote/:${title}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    }

  handleDeleteNote = async(index) => {
    const newStates = [...this.state.notes];
    newStates.splice(index, 1);
    this.setState(state => ({
      notes: newStates
    }));
    console.log(index);
    const response = await fetch(`http://localhost:5000/deleteNote/${index}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  handleLogin = async(username, password) => {
    if (username == "" || password == "")
    {
      console.log("please write username and password");
    } else {
    const response = await fetch(`http://localhost:5000/login/:${username}/:${password}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data)
    {
      data.Notes.forEach((note) => 
        this.setState( prevState => {
          if (note != null)
          {
          return {
            notes: [
              ...prevState.notes,
              {
                value: note["value"],
                title: note["title"],
                id: this.prevId +=1
              }
            ]
          };
        }
        })
      );
      return data.Notes;
    }
    else
      console.log("wrong username or password");
    }
  }

  handlePassword = async() => {
    const response = await fetch(`http://localhost:5000/update/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
  }

  render() {
    ReactDOM.render(
      <div className = 'd-flex justify-content-evenly'>
        <h1 id = 'main-title' className = 'navbar-brand'>Notes App</h1>
        <AddNoteButton addNote = {this.handleAddNote} />
        <LoginButton userLogin = {this.handleLogin} />
      </div>
      
      ,document.getElementById('main-nav')
    )
    
    return (
      <div id = 'app-container' className = 'container-fluid d-flex flex-column justify-content-center align-items-center'>
          <div id = 'notes-container' className = 'container d-flex justify-content-center wrap'>
            {this.state.notes.map( (note, index) =>
              <NoteCard changeText = {this.handleNoteUpdate} value = {note.value} index = {index} title = {note.title} deleteNote = {this.handleDeleteNote}/>
            )}
          </div>

      </div>


    );
  }


}

export default App;
