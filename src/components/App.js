import React from 'react';
import ReactDOM from 'react-dom';
import LoginButton from './LoginButton';
import NoteCard from './NoteCard';
import AddNoteButton from './AddNoteButton';
class App extends React.Component {
  // States
  state = {
    notes: [],
    loggedin: false,
    missingInfo: false,
    wrongInfo: false,
    currentText: '',
    typing: false,
    typingTimeout: 0,
    currentTitle: '',
    titleTyping: false,
    titleTypingTimeout: 0
  }
  prevId = 0;

  // Handles Updating textarea of each note
  handleNoteUpdate = async(noteID,updatedText) => {
    var index = this.state.notes.findIndex(note => note.id === noteID);
    this.state.notes[index].value = updatedText
    this.forceUpdate()
    const self = this;
    if (self.state.typingTimeout) {
       clearTimeout(self.state.typingTimeout);
    }
    if (this.state.loggedin)
    {
      self.setState({
        currentText: updatedText,
        typing: false,
        typingTimeout: setTimeout(async function () {
          await fetch(`http://localhost:5000/update/${self.state.userID}/${noteID}/${updatedText}`, {
            method: "POST"
          });
          }, 1000)
     });
    }
  }

  // Handles Updating textarea of each note
  handleNoteTitleUpdate = async(noteID, updatedText) => {
    var index = this.state.notes.findIndex(note => note.id === noteID);
    this.state.notes[index].title = updatedText
    this.forceUpdate()
    const self = this;
    if (self.state.titleTypingTimeout) {
       clearTimeout(self.state.titleTypingTimeout);
    }
    if (this.state.loggedin)
    {
      self.setState({
        currentTitle: updatedText,
        titleTyping: false,
        titleTypingTimeout: setTimeout(async function () {
          await fetch(`http://localhost:5000/updateTitle/${self.state.userID}/${noteID}/${updatedText}`, {
            method: "POST"
          });
          }, 1000)
     });
    }
  }

  // Handles adding New note
  handleAddNote = async(title) => {
    // Adding the Database with the New Note
    if (this.state.loggedin)
    {
      const response =  await fetch(`http://localhost:5000/addNote/${this.state.userID}/${title}`, {
        method: "POST"
      });
      const noteID = await response.json();
      this.setState( prevState => {
        return {
          notes: [
            ...prevState.notes,
            {
              value: '',
              title,
              id: noteID
            }
          ]
        };
      });
    } else {
      this.setState( prevState => {
        return {
          notes: [
            ...prevState.notes,
            {
              value: '',
              title
            }
          ]
        };
      });
    }
  }

  // Handles Deleting a note
  handleDeleteNote = async(noteID) => {
    this.setState(prevState => {
      const notes = prevState.notes.filter(note => note.id !== noteID);
      return { notes };
  });
    
    if (this.state.loggedin)
    {
     await fetch(`http://localhost:5000/deleteNote/${this.state.userID}/${noteID}`, {
        method: "POST"
      });
    }
  }

  // Handles Logout
  handleLogout = async () => {
    this.setState(state => ({
      loggedin: false,
      notes: [],
      userID: ""
    })); 
  }

  // Handles Login Operation
  handleLogin = async(username, password) => {
    if (username == "" || password == "")
    {
      console.log("please enter username and password");
    } else {
    // Check Entered username and password
    const data = await this.getUserInfo(username, password);
    if (data)
    {
      // Update the states with the User entered Info
      this.setState(state => ({
        loggedin: true,
        userID: data._id,
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
      method: "GET"
    });
    const data = await response.json();
    return data;
  }

  // Add the notes added before login to the User Notes
  addNotesBeforeLogin = async() =>
  {
    for (let i = 0; i < this.state.notes.length; i++)
    {
      const response = await fetch(`http://localhost:5000/addNote/${this.state.userID}/${this.state.notes[i].title}/${this.state.notes[i].value}`, {
        method: "POST"
      });
      const noteID = await response.json();

      this.setState(prevState => ({
        notes: [
            ...prevState.notes.slice(0,i),
            {
                ...prevState.notes[i],
                _id: noteID
            },
            ...prevState.notes.slice(i + 1)
        ]
    }));

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
                  id: note['_id']
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
    await fetch(`http://localhost:5000/register/${username}/${password}`, {
          method: "POST"
    });
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
              <NoteCard changeText = {this.handleNoteUpdate} changeTitle = {this.handleNoteTitleUpdate} noteInfo ={note} deleteNote = {this.handleDeleteNote}/>
            )}
          </div>

      </div>
    );
  }
}

export default App;
