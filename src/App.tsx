import "./App.css";
import { Information } from "./components/information";
import { Map } from "./components/map";
import { Sidebar } from "./components/sidebar";
import { Notification } from "./components/notification";

function App() {
  return (
    <div className="App">
      <Sidebar />
      <Map />
      <Information />
      <Notification />
    </div>
  );
}

export default App;
