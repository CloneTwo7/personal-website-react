import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css';


//Square function takes in the props and adjusts the values of the squares of the game
function Square(props) {
    return (
      //On cick, it adjusts the props value
      <button className="square" onClick={() => {props.onClick()}}>
        {props.value}
      </button>
    );
}

//The Board class handles all the squares and checks for a winner
class Board extends React.Component {
  handleClick(i) {
    //checks to see if someone wins or if the squares are all toggled
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return; //returns if game ends
    }
    //sets the value inputed depending on whose turn it is
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    //adjusts the state based on whos turn it was
    this.setState({
      squares: squares, //sets the board's square values to the local square values
      xIsNext: !this.state.xIsNext, //changes whose turn it is
    });
  }

  renderSquare(i) {
    return (
      <Square //displays the values of the individual square and displays the button 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  //Renders the board
  render() {
    return (
      /* Renders each individual square of the board row by row */
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  } 

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length -1];
    const squares = current.squares.slice();
    
    console.log('clicked square #' + i);
    
    if(calculateWinner(squares) || squares[i]) return;
    
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    }); 
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to Move #' + move : 'Go to Game Start';
      return (
        <li className="moveEntry">
          <button className="pastMove" onClick = {() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    let status;
    if(winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="winScreen">
        </div>
        <div className="game-board">
          <Board 
          squares = {current.squares}
          onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <ol className="movesList">{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}