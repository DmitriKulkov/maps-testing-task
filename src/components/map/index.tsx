import { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./map.css";
import { getStores } from "../../stores";

export const CENTER_COORDS: [number, number] = [139.753, 35.6844];
export const INITIAL_ZOOM = 14;

export const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${
        import.meta.env.VITE_API_KEY
      }`,
      center: CENTER_COORDS,
      zoom: INITIAL_ZOOM,
    });
    const { mapStore } = getStores();
    mapStore.setMap(map.current);
  }, []);

  return (
    <div className="map-wrap">
      {!map.current || (!map.current.loaded() && "loading...")}
      <div ref={mapContainer} className="map" />
    </div>
  );
};
