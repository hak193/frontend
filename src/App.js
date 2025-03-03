import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="Diesel's logo" />
        <h1>Welcome to Diesel's</h1>
        <p>
          Fuel Your Deals - Your online marketplace for unique finds and great deals!
        </p>
        <p>
          Explore our features:
        </p>
        <ul>
          <li>Diesel's Garage: Top-rated sellers and their products</li>
          <li>Turbo Deals: Daily featured deals</li>
          <li>Diesel's Live: Real-time auctions</li>
          <li>Diesel's Local: Buy from local sellers</li>
        </ul>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn More
        </a>
      </header>
    </div>
  );
}

export default App;
