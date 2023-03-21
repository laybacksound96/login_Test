import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router";
import axios from "axios";

const LoginPage = () => {
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    axios.get("/api/user").then((res) => setUser(res.data));
  }, []);

  const handleLogin = () => {
    window.location.href = "/api/auth/login";
  };

  const handleLogout = () => {
    axios.post("/api/auth/logout").then(() => {
      setUser(null);
      history.push("/");
    });
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Hello, {user.discordTag}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <p>Please login</p>
          <button onClick={handleLogin}>Login with Discord</button>
          <Link to="/">Home</Link>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
