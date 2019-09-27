import React, { Component } from 'react';
import axios from 'axios';
import './Thoughts.css';

class Thoughts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thoughts: [],
    };
  }

  componentDidMount() {
    axios
      .get('http://localhost:5001/api/thoughts/')
      .then(res => this.setState({ thoughts: res.data }))
      .catch(alert);
  }

  render() {
    const { thoughts } = this.state;
    console.log('THOUGHTS > ', this.state.thoughts);
    return (
      <div className="App">
        {/* Buttons to interact with API */}
        <button onClick={this.createThought.bind(this)}>Create Thought(s)</button>
        <button onClick={this.deleteThoughts.bind(this)}>Delete Thoughts</button>
        {/* List of thoughts in Cosmos DB */}
        <ul>
          {thoughts.length > 0 && thoughts.map(thought => (
            <li
              style={{ listStyleType: 'none', margin: '20px', borderBottom: '1px solid black' }}
              key={thought.id}
            >
              {thought.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  createThought() {
    const thought = prompt('Enter your thought: ');
    if (!thought) return;
    axios
      .post('http://localhost:5001/api/thoughts/create', { thought })
      .then(res => this.setState({ thoughts: [...this.state.thoughts, res.data.newThought] }))
      .catch(err => alert(`Failed to create thought\n${JSON.stringify(err)}`));
  }

  deleteThoughts() {
    const doDelete = window.confirm('Delete all Thoughts?');
    if (!doDelete) return;
    axios
      .delete('http://localhost:5001/api/thoughts/')
      .then(res => this.setState({ thoughts: [] }))
      .catch(err => alert(`Failed to delete all thoughts\n${JSON.stringify(err)}`));
  }
}

export default Thoughts;
