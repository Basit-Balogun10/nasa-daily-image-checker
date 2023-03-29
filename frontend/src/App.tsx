import react, {useState, useEffect} from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import { UserProvider } from './contexts/UserContext'
import type {User} from './contexts/UserContext'

function App() {
  const [user, setUser] = useState<User | null>(null)

  const handleUserChange = (user: User | null) => {
    localStorage.setItem("NDIC-user", JSON.stringify(user))
    setUser(user);
  }

  useEffect(() => {
    if (localStorage.getItem("NDIC-user")) {
        setUser(JSON.parse(localStorage.getItem("NDIC-user")!));
    }
  }, [])

  return (
      <UserProvider value={{ user, handleUserChange }}>
          <Router>
              <div className="container">
                  <Header />
                  <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                  </Routes>
              </div>
          </Router>
          <ToastContainer />
      </UserProvider>
  );
}

export default App
