import { getStores } from "../../stores";
import { observer } from "mobx-react-lite";
import "./information.css";

export const Information = observer(() => {
  const { mapStore } = getStores();

  return (
    <div className="info" hidden={!mapStore.currentInformation}>
      <h1 className="info__title">Information:</h1>
      <div className="info__list">
        <span className="info__label">Creation Date:</span>
        <span>{mapStore.currentInformation ?? "None"}</span>
      </div>
    </div>
  );
});
