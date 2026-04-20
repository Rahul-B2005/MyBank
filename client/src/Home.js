import './App.css';
import image1 from './image1.png';

function Home() {
  return (
    <div>
     
      {/* Existing Content */}
      <section>
        <h2>Welcome to MyBank</h2>
        <p>Your trusted partner in banking. We offer the best services to help you manage your finances efficiently.</p>
        <img src={image1} alt="Banking illustration" />
      </section>

      {/* New Features Section */}
      <section>
        <h2>Our Features</h2>
        <ul>
          <li><strong>24/7 Customer Support:</strong> We're here to help anytime, anywhere.</li>
          <li><strong>Secure Transactions:</strong> Your security is our top priority.</li>
          <li><strong>Online Account Management:</strong> Manage your accounts easily online.</li>
        </ul>
      </section>

      <footer>
        &copy; 2026 MyBank. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;