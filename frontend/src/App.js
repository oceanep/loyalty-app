import { useEffect, useState } from 'react'
import axios from 'axios'
import logo from './logo.svg';
import './App.css';

function App() {

  const [books, setBooks] = useState([])

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const res = await axios.get("http://localhost:8000/book");
        console.log(res)
        setBooks(res.data);
      } catch (err){
        console.log(err)
      }
    }
    loadBooks()
    console.log('books', books)
  },  [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <ul>
        {
          books.length > 0 ?
            books.map(book => <li key={book}>{book}</li>)
          :
            null
        }
        </ul>
      </header>
    </div>
  );
}

export default App;
