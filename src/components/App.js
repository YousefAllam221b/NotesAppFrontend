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

  handleAddNote = (title) => {
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
    }

  handleDeleteNote = (index) => {
        const newStates = [...this.state.notes];
        newStates.splice(index, 1);

        this.setState(state => ({
            notes: newStates
        }));
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
      <AddNoteButton addNote = {this.handleAddNote} />,
        document.getElementById('add-note-button'),
    )
    ReactDOM.render(
    <LoginButton userLogin = {this.handleLogin} />,
        document.getElementById('login')
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
