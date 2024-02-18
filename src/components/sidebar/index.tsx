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
      <button
        className="sidebar__button"
        onClick={handleAddPoint}
        disabled={!!mapStore.isAdding}
      >
        Add point
      </button>
      <button
        className="sidebar__button"
        onClick={clearPoints}
        disabled={!!mapStore.isAdding}
      >
        Clear points
      </button>
      <button
        className="sidebar__button"
        onClick={handleAddLine}
        disabled={!!mapStore.isAdding}
      >
        Add line
      </button>
      <button
        className="sidebar__button"
        onClick={clearLines}
        disabled={!!mapStore.isAdding}
      >
        Clear lines
      </button>
      <hr />
      <span className="sidebar__title">Visibility:</span>
      <div>
        <label htmlFor="points">Points</label>
        <input
          id="points"
          type="checkbox"
          defaultChecked
          onChange={handleTogglePoints}
        />
      </div>
      <div>
        <label htmlFor="lines">Lines</label>
        <input
          id="lines"
          type="checkbox"
          defaultChecked
          onChange={handleToggleLines}
        />
      </div>
    </div>
  );
});
