import { action, makeObservable, observable } from "mobx";
import { feature, featureCollection } from "@turf/helpers";
import { GeoJSONSource, TypedStyleLayer } from "maplibre-gl";
import { FeatureCollection } from "geojson";

type FeatureType = "line" | "point" | undefined;

export class MapStore {
  @observable map: maplibregl.Map | null = null;

  @observable isAdding: FeatureType;

  @observable lineFirstPoint: [number, number] | undefined;

  @observable isLoading = false;

  @observable hiddenLayers: FeatureType[] = [];

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
    this.map.on("load", () => {
      this.map?.addSource("point", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      this.map?.addSource("line", {
        type: "geojson",
        data: featureCollection([]),
      });

      this.map?.addLayer({
        id: "point",
        type: "circle",
        source: "point",
        paint: {
          "circle-color": "#ff0000",
          "circle-radius": 5,
        },
      });

      this.map?.addLayer({
        id: "line",
        type: "line",
        source: "line",
        paint: {
          "line-color": "#ff0000",
          "line-width": 5,
        },
      });
    });
  }

  private addPoint(coords: [number, number]) {
    if (!this.map?.loaded()) {
      return;
    }
    const creationDate = `${new Date().getTime()}`;
    const point = feature({
      id: creationDate,
      type: "Point",
      coordinates: coords,
      properties: {},
    });
    const source = this.map.getSource("point") as GeoJSONSource;
    source.setData(
      featureCollection([
        ...(source._data as FeatureCollection).features,
        point,
      ])
    );

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
    const creationDate = `${new Date().getTime()}`;
    const line = feature({
      id: creationDate,
      type: "LineString",
      coordinates: [this.lineFirstPoint, coords],
      properties: {},
    });
    const source = this.map.getSource("line") as GeoJSONSource;
    source.setData(
      featureCollection([...(source._data as FeatureCollection).features, line])
    );
    this.setIsAdding();
    this.lineFirstPoint = undefined;
  }

  @action setIsAdding(type?: FeatureType) {
    if (!type || !this.isAdding) this.isAdding = type;
  }

  @action toggleLayerVisibility(type: NonNullable<FeatureType>) {
    if (!this.map) {
      return;
    }
    if (this.map.getLayoutProperty(type, "visibility") !== "none") {
      this.map?.setLayoutProperty(type, "visibility", "none");
    } else {
      this.map?.setLayoutProperty(type, "visibility", "visible");
    }
  }

  @action clearLayer(type: NonNullable<FeatureType>) {
    if (!this.map) {
      return;
    }
    const source = this.map.getSource(type) as GeoJSONSource;
    source.setData(featureCollection([]));
  }
}
