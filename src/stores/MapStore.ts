import { action, makeObservable, observable } from "mobx";
import {} from "@turf/helpers";
import { feature, point } from "@turf/helpers";

type FeatureType = "line" | "point" | undefined;

export class MapStore {
  @observable map: maplibregl.Map | null = null;

  @observable isAdding: FeatureType = "line";

  @observable lineFirstPoint: [number, number] | undefined;

  @observable isLoading = false;

  constructor() {
    makeObservable(this);
  }

  @action setMap(map: maplibregl.Map) {
    this.map = map;
    this.map.on("click", (e) => {
      switch (this.isAdding) {
        case "point":
          this.addPoint([e.lngLat.lng, e.lngLat.lat]);
          break;
        case "line":
          this.addLine([e.lngLat.lng, e.lngLat.lat]);
          break;
        default:
          break;
      }
    });
  }

  private addPoint(coords: [number, number]) {
    if (!this.map?.loaded()) {
      return;
    }
    const creationDate = `${Math.floor(new Date().getTime())}`;
    const point = feature({
      type: "Point",
      coordinates: coords,
      properties: {},
    });
    this.map.addSource(creationDate, {
      type: "geojson",
      data: point,
    });

    this.map.addLayer({
      id: creationDate,
      type: "circle",
      source: creationDate,
      paint: {
        "circle-color": "#ff0000",
        "circle-radius": 5,
      },
    });
    this.setIsAdding();
  }

  private addLine(coords: [number, number]) {
    if (!this.map?.loaded()) {
      return;
    }

    if (!this.lineFirstPoint) {
      this.lineFirstPoint = coords;
      return;
    }
    const creationDate = `${Math.floor(new Date().getTime())}`;
    const line = feature({
      type: "LineString",
      coordinates: [this.lineFirstPoint, coords],
      properties: {},
    });
    this.map.addSource(creationDate, {
      type: "geojson",
      data: line,
    });

    this.map.addLayer({
      id: creationDate,
      type: "line",
      source: creationDate,
      paint: {
        "line-color": "#ff0000",
        "line-width": 5,
      },
    });
    this.setIsAdding();
    this.lineFirstPoint = undefined;
  }

  @action setIsAdding(type?: FeatureType) {
    this.isAdding = type;
  }
}
