import { observer } from "mobx-react-lite";
import { getStores } from "../../stores";
import "./sidebar.css";

export const Sidebar = observer(() => {
  const { mapStore } = getStores();

  const handleAddPoint = () => mapStore.setIsAdding("point");
  const handleAddLine = () => mapStore.setIsAdding("line");

  const handleTogglePoints = () => mapStore.toggleLayerVisibility("point");
  const handleToggleLines = () => mapStore.toggleLayerVisibility("line");

  const clearPoints = () => mapStore.clearLayer("point");
  const clearLines = () => mapStore.clearLayer("line");

  return (
    <div className="sidebar">
      <button onClick={handleAddPoint} disabled={!!mapStore.isAdding}>
        add point
      </button>
      <button onClick={handleTogglePoints} disabled={!!mapStore.isAdding}>
        toggle points
      </button>
      <button onClick={clearPoints} disabled={!!mapStore.isAdding}>
        clear points
      </button>
      <button onClick={handleAddLine} disabled={!!mapStore.isAdding}>
        add line
      </button>
      <button onClick={handleToggleLines} disabled={!!mapStore.isAdding}>
        toggle lines
      </button>
      <button onClick={clearLines} disabled={!!mapStore.isAdding}>
        clear lines
      </button>
    </div>
  );
});
