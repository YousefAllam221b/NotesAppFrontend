import React from 'react';
import ReactDOM from 'react-dom';
import LoginButton from './LoginButton';
import NoteCard from './NoteCard';
import AddNoteButton from './AddNoteButton';
class App extends React.Component {
  // States
  state = {notes: [],
  loggedin: false}
  prevId = 0;

 

  // Handles Updating textarea of each note
  handleNoteUpdate = async(index, updatedText) => {
    this.state.notes[index].value = updatedText
    this.forceUpdate()
    if (this.state.loggedin)
    {
      const response = await fetch(`http://localhost:5000/update/${this.state.userID}/${index}/${updatedText}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }

  // Handles Updating textarea of each note
  handleNoteTitleUpdate = async(index, updatedText) => {
    this.state.notes[index].title = updatedText
    this.forceUpdate()
    if (this.state.loggedin)
    {
      const response = await fetch(`http://localhost:5000/updateTitle/${this.state.userID}/${index}/${updatedText}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }

  // Handles adding new note
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
    if (this.state.loggedin)
    {
        const response = await fetch(`http://localhost:5000/addNote/${this.state.userID}/${title}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }

  // Handles Deleting a note
  handleDeleteNote = async(index) => {
    const newStates = [...this.state.notes];
    newStates.splice(index, 1);
    this.setState(state => ({
      notes: newStates
    }));
    if (this.state.loggedin)
    {
      const response = await fetch(`http://localhost:5000/deleteNote/${this.state.userID}/${index}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }

  // Handles Logout
  handleLogout = async () => {
    this.setState(state => ({
      loggedin: false,
      notes: [],
      userID: "",
      username: "",
      password: ""
    })); 
  }

  // Handles Login Operation
  handleLogin = async(username, password) => {
    if (username == "" || password == "")
    {
      console.log("please write username and password");
    } else {
    // Check Entered username and password
    const data = await this.getUserInfo(username, password);
    
    if (data)
    {
      // Update the states with the User entered Info
      this.setState(state => ({
        loggedin: true,
        userID: data._id,
        username: username,
        password: password
      })); 
      
      // Add the notes added before login to the User Notes
      await this.addNotesBeforeLogin();
      
      const allData = await this.getUserInfo(username, password);
      // Show all notes
      this.showAllNotes(allData);
    }
    else
      console.log("wrong username or password");
    }
  }

  // Get User info with input username and password.
  getUserInfo = async(username, password) =>
  {
    const response = await fetch(`http://localhost:5000/login/${username}/${password}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  }

  // Add the notes added before login to the User Notes
  addNotesBeforeLogin = async() =>
  {
    for (const note of this.state.notes)
    {
      const response = await fetch(`http://localhost:5000/addNote/${this.state.userID}/${note.title}/${note.value}`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
      });
    }
  }

  // Show all notes
  showAllNotes = (data) =>
  {
    this.setState(state => ({
      notes: []
    }));
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
  }

  // Handling Register operation
  handleRegister = async(username, password) =>
  {
    if (username == "" || password == "")
      console.log("please write username and password");
    else
    {
      // Check if Username is available
      if(await this.checkUsername(username))
        console.log("Username already taken");
      else
      {
        // Register
        await this.regsiter(username, password);
        await this.handleLogin(username, password);
      }
    }
  }

  // Checks wether the Username is available or already exists
  checkUsername = async(username) =>
  {
    const response = await fetch(`http://localhost:5000/register/${username}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    const data = await response.json();
    return data
  }

  // Accepts and Register the data 
  regsiter = async(username, password) =>
  {
    const response = await fetch(`http://localhost:5000/register/${username}/${password}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
    });
    const data = await response.json();
  }
  
  render() {
    // Navbar Rendering
    ReactDOM.render(
      <div className = 'd-flex justify-content-evenly'>
        <h1 id = 'main-title' className = 'navbar-brand'>Notes App</h1>
        <AddNoteButton addNote = {this.handleAddNote} />  
        {!this.state.loggedin && <LoginButton userLogin = {this.handleLogin} userRegister = {this.handleRegister} />}
        {this.state.loggedin && <input type = 'button' value = 'Logout' onClick={this.handleLogout}/>}
      </div>
      ,document.getElementById('main-nav')
    )
    
    // Notes Rendering
    return (
      <div id = 'app-container' className = 'container-fluid d-flex flex-column justify-content-center align-items-center'>
          <div id = 'notes-container' className = 'container d-flex justify-content-center wrap'>
            {this.state.notes.map( (note, index) =>
              <NoteCard changeText = {this.handleNoteUpdate} changeTitle = {this.handleNoteTitleUpdate} value = {note.value} index = {index} title = {note.title} deleteNote = {this.handleDeleteNote}/>
            )}
          </div>

      </div>
    );
  }
}

export default App;
