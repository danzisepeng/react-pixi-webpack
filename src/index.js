import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './css/index.css'
//import './index.css';
//import App from './App';

class App extends Component {
    render() {
        return (
            <div className="wel">
                welcome yourself
            </div>
        )
    }
}

ReactDOM.render(<App />,document.getElementById('root'));