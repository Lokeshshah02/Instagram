import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Singup from "./components/Signup";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Singup />
    </>
  );
}

export default App;
