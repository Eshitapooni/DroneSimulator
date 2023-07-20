import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import maplibregl from "maplibre-gl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faStop } from "@fortawesome/free-solid-svg-icons";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const MapPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const latitude = parseFloat(searchParams.get("latitude"));
  const longitude = parseFloat(searchParams.get("longitude"));
  const time = parseInt(searchParams.get("time"));

  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const droneMarker = useRef(null);
  const pathLine = useRef(null);
  const [animationInterval, setAnimationInterval] = useState(null);
  const [animationState, setAnimationState] = useState("stopped");

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const newMap = new maplibregl.Map({
      container: mapContainerRef.current,
      style:
        "https://api.maptiler.com/maps/streets/style.json?key=2dwQieqbhMCkajL9eVlR",
      center: [77.25, 28.625],
      zoom: 4,
    });

    setMap(newMap);

    return () => {
      newMap.remove();
      setMap(null);
    };
  }, []);
  const startIcon = (
    <FontAwesomeIcon
      icon={faMapMarkerAlt}
      style={{ fontSize: "24px", color: "green" }}
    />
  );

  useEffect(() => {
    if (map) {
      map.on("style.load", () => {
        map.addLayer({
          id: "path-line",
          type: "line",
          source: {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: [[77.25, 28.625]],
              },
            },
          },
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "blue", "line-width": 2 },
        });
        pathLine.current = map.getSource("path-line");
      });

      map.on("error", (event) => {
        console.error("Map error:", event.error);
      });
    }
  }, [map]);

  const startAnimation = () => {
    let currentLatitude = 28.625;
    let currentLongitude = 77.25;
    const latitudeStep = (latitude - currentLatitude) / (time * 60);
    const longitudeStep = (longitude - currentLongitude) / (time * 60);

    const interval = setInterval(() => {
      if (!pathLine.current || !pathLine.current._data) {
        return;
      }

      if (droneMarker.current) {
        droneMarker.current.setLngLat([currentLongitude, currentLatitude]);
      }

      const coordinates = pathLine.current._data.geometry.coordinates;
      coordinates.push([currentLongitude, currentLatitude]);
      pathLine.current.setData(pathLine.current._data);

      currentLatitude += latitudeStep;
      currentLongitude += longitudeStep;

      console.log(currentLatitude);

      const isLatitudeReached =
        (latitudeStep >= 0 && currentLatitude >= latitude) ||
        (latitudeStep < 0 && currentLatitude <= latitude);

      const isLongitudeReached =
        (longitudeStep >= 0 && currentLongitude >= longitude) ||
        (longitudeStep < 0 && currentLongitude <= longitude);

      if (isLatitudeReached && isLongitudeReached) {
        clearInterval(interval);
        setAnimationState("stopped");
      }
    }, 1000 / 60);

    setAnimationInterval(interval);
  };

  const handlePlay = () => {
    if (animationState === "stopped") {
      setAnimationState("playing");
      setIsAnimating(true);
    } else if (animationState === "paused") {
      setAnimationState("playing");
      setIsAnimating(true);
      startAnimation();
    }
  };

  const handlePause = () => {
    if (animationState === "playing") {
      clearInterval(animationInterval);
      setAnimationState("paused");
      setIsAnimating(false);
    }
  };

  const handleStop = () => {
    clearInterval(animationInterval);
    setAnimationInterval(null);
    setAnimationState("stopped");
    const coordinates = pathLine.current._data.geometry.coordinates;
    coordinates.splice(1);
    pathLine.current.setData(pathLine.current._data);
    setIsAnimating(false);
  };

  useEffect(() => {
    if (isAnimating && animationState === "playing") {
      startAnimation();
    }
  }, [isAnimating, animationState]);

  return (
    <div>
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "100vh" }}
      ></div>

      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <button
          style={{
            fontSize: "16px",
            padding: "10px",
            margin: "0 5px",
            transition: "font-size 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.fontSize = "20px")}
          onMouseLeave={(e) => (e.target.style.fontSize = "16px")}
          onClick={handlePlay}
          disabled={animationState === "playing"}
        >
          <FontAwesomeIcon icon={faPlay} />
        </button>
        <button
          style={{
            fontSize: "16px",
            padding: "10px",
            margin: "0 5px",
            transition: "font-size 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.fontSize = "20px")}
          onMouseLeave={(e) => (e.target.style.fontSize = "16px")}
          onClick={handlePause}
          disabled={animationState !== "playing"}
        >
          <FontAwesomeIcon icon={faPause} />
        </button>
        <button
          style={{
            fontSize: "16px",
            padding: "10px",
            margin: "0 5px",
            transition: "font-size 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.fontSize = "20px")}
          onMouseLeave={(e) => (e.target.style.fontSize = "16px")}
          onClick={handleStop}
        >
          <FontAwesomeIcon icon={faStop} />
        </button>
      </div>
    </div>
  );
};

export default MapPage;
