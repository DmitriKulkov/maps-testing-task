import { action, makeObservable, observable, runInAction } from "mobx";
import { feature, featureCollection } from "@turf/helpers";
import { GeoJSONSource, Point, PointLike } from "maplibre-gl";
import { FeatureCollection } from "geojson";
import moment from "moment";

const FEATURE_LAYERS = ["line", "point"] as const;

type FeatureType = (typeof FEATURE_LAYERS)[number] | undefined;

const CLICK_AREA_RADIUS = 5;

export class MapStore {
  @observable map: maplibregl.Map | null = null;

  @observable isAdding: FeatureType;

  @observable lineFirstPoint: [number, number] | undefined;

  @observable currentInformation: string | undefined;

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
          this.selectFeature(e.point);
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
        data: featureCollection([]) as GeoJSON.GeoJSON,
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
    runInAction(() => {
      if (!this.map?.loaded()) {
        return;
      }
      const creationDate = `${new Date().getTime()}`;
      const point = feature({
        type: "Point",
        coordinates: coords,
        properties: {},
      });
      point.id = creationDate;
      const source = this.map.getSource("point") as GeoJSONSource;
      source.setData(
        featureCollection([
          ...(source._data as FeatureCollection).features,
          point,
        ]) as GeoJSON.GeoJSON
      );

      this.setIsAdding();
    });
  }

  private addLine(coords: [number, number]) {
    runInAction(() => {
      if (!this.map?.loaded()) {
        return;
      }

      if (!this.lineFirstPoint) {
        this.setLineFirstPoint(coords);
        return;
      }
      const creationDate = `${new Date().getTime()}`;
      const line = feature({
        type: "LineString",
        coordinates: [this.lineFirstPoint, coords],
        properties: {},
      });
      line.id = creationDate;
      const source = this.map.getSource("line") as GeoJSONSource;
      source.setData(
        featureCollection([
          ...(source._data as FeatureCollection).features,
          line,
        ]) as GeoJSON.GeoJSON
      );
      this.setIsAdding();
      this.setLineFirstPoint();
    });
  }

  @action setLineFirstPoint(point?: [number, number]) {
    this.lineFirstPoint = point;
  }

  private selectFeature(point: Point) {
    runInAction(() => {
      if (!this.map) return;
      const area: [PointLike, PointLike] = [
        [point.x - CLICK_AREA_RADIUS, point.y - CLICK_AREA_RADIUS],
        [point.x + CLICK_AREA_RADIUS, point.y + CLICK_AREA_RADIUS],
      ];
      const features = this.map.queryRenderedFeatures(area, {
        layers: [...FEATURE_LAYERS],
      });
      if (!(features.length && features[0].id)) {
        this.currentInformation = undefined;
        return;
      }
      this.currentInformation = moment(features[0].id).format("DD.MM.YYYY");
    });
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
    source.setData(featureCollection([]) as GeoJSON.GeoJSON);
  }
}
