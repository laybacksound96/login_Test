import { useEffect, useState } from "react";
import axios from "axios";

const DashboardPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("/api/user").then((res) => setUser(res.data));
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <p>Hello, {user.discordTag}!</p>
        </div>
      ) : (
        <div>
          <p>Please login to access the dashboard</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
