import { observer } from "mobx-react-lite";
import { getStores } from "../../stores";
import "./notification.css";

export const Notification = observer(() => {
  const { mapStore } = getStores();
  return (
    <div className="notification" hidden={!mapStore.isAdding}>
      <h1 className="notificationh__header">
        {mapStore.lineFirstPoint
          ? "Add another point on the map"
          : "Add point on the map"}
      </h1>
    </div>
  );
});
