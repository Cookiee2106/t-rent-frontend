import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

function HomePage() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axiosClient
      .get("/")
      .then((res) => {
        setMessage(res.data.message);
      })
      .catch(() => {
        setMessage("Không gọi được API backend");
      });
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>T-Rent Frontend</h1>
      <p>API message: {message}</p>
    </div>
  );
}

export default HomePage;