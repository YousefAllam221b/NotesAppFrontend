import React from 'react';
import Note from './Note';

class NoteCard extends React.Component
{
  handleDeleteNote = (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.props.deleteNote(this.props.index);
  }

  handleChange = (event) => {
    this.props.changeText(this.props.index, event.target.value)
  }

  handleTitleChange = (event) => {
    this.props.changeTitle(this.props.index, event.target.value)
  }

  render() {
    return (
      <div className = 'card-body note col-12'>
        <div id = 'note-title' className = 'd-flex align-items-center justify-content-between'>
          <textarea className ="note-title" value={this.props.title} onChange={this.handleTitleChange}></textarea>
          <button onClick = {this.handleDeleteNote} id="close-button" type="button" className="btn-close text-reset me-3" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <textarea className ="note-content note" value={this.props.value} onChange={this.handleChange}></textarea>
      </div>
    );
  }
}
export default NoteCard;
