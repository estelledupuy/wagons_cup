import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="map"
export default class extends Controller {
  static values = {
    apiKey: String,
  }

  connect() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZ3dlbm9sYWRsdiIsImEiOiJjbGR5a3p2ZHcwcGk4M29vYXFwYmFud29sIn0.08C-MI7cVgVER-64a0WO3w'

    this.map = new mapboxgl.Map({
      container: this.element,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [-122.486052, 37.830348],
      zoom: 14
    })

    this._draw_animated_line();
    this._draw_line();
  }

  _draw_line() {
    this.map.on('load', () => {
      this.map.addSource('route', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
          'type': 'LineString',
          'coordinates': [
              [-122.483696, 37.833818],
              [-122.483482, 37.833174],
              [-122.483396, 37.8327],
              [-122.483568, 37.832056],
              [-122.48404, 37.831141],
              [-122.48404, 37.830497],
              [-122.483482, 37.82992],
              [-122.483568, 37.829548],
              [-122.48507, 37.829446],
              [-122.4861, 37.828802],
              [-122.486958, 37.82931],
              [-122.487001, 37.830802],
              [-122.487516, 37.831683],
              [-122.488031, 37.832158],
              [-122.488889, 37.832971],
              [-122.489876, 37.832632],
              [-122.490434, 37.832937],
              [-122.49125, 37.832429],
              [-122.491636, 37.832564],
              [-122.492237, 37.833378],
              [-122.493782, 37.833683]
            ]
          }
        }
      });

      this.map.addLayer({
          'id': 'route',
          'type': 'line',
          'source': 'route',
          'layout': {
          'line-join': 'round',
          'line-cap': 'round'
          },
          'paint': {
          'line-color': '#888',
          'line-width': 8
          }
      });
    });
  }

  _draw_animated_line() {
    this.map.on('load', async () => {
      // We fetch the JSON here so that we can parse and use it separately
      // from GL JS's use in the added source.
      const response = await fetch(
        'https://docs.mapbox.com/mapbox-gl-js/assets/hike.geojson'
      );
      const data = await response.json();
      // save full coordinate list for later
      const coordinates = data.features[0].geometry.coordinates;

      // start by showing just the first coordinate
      data.features[0].geometry.coordinates = [coordinates[0]];

      // add it to the map
      this.map.addSource('trace', { type: 'geojson', data: data });
      this.map.addLayer({
        'id': 'trace',
        'type': 'line',
        'source': 'trace',
        'paint': {
        'line-color': 'yellow',
        'line-opacity': 0.75,
        'line-width': 5
        }
      });

      // setup the viewport
      this.map.jumpTo({ 'center': coordinates[0], 'zoom': 14 });
      this.map.setPitch(30);

      // on a regular basis, add more coordinates from the saved list and update the map
      let i = 0;
      const timer = setInterval(() => {
        if (i < coordinates.length) {
          data.features[0].geometry.coordinates.push(coordinates[i]);
          this.map.getSource('trace').setData(data);
          this.map.panTo(coordinates[i]);
          i++;
        } else {
          window.clearInterval(timer);
        }
      }, 10);
    });
  }

  _draw_curve_line() {
    const geojson = {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'geometry': {
          'type': 'LineString',
          'coordinates': [[0, 0]]
          }
        }
      ]
    };

      const speedFactor = 30; // number of frames per longitude degree
      let animation; // to store and cancel the animation
      let startTime = 0;
      let progress = 0; // progress = timestamp - startTime
      let resetTime = false; // indicator of whether time reset is needed for the animation

      this.map.on('load', () => {
        this.map.addSource('line', {
          'type': 'geojson',
          'data': geojson
        });

      // add the line which will be modified in the animation
        this.map.addLayer({
          'id': 'line-animation',
          'type': 'line',
          'source': 'line',
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
            },
          'paint': {
          'line-color': '#ed6498',
          'line-width': 5,
          'line-opacity': 0.8
            }
        });

        startTime = performance.now();

        animateLine();

      // click the button to pause or play

      // reset startTime and progress once the tab loses or gains focus
      // requestAnimationFrame also pauses on hidden tabs by default
        document.addEventListener('visibilitychange', () => {
          resetTime = true;
        });

        // animated in a circle as a sine wave along the map.
        function animateLine(timestamp) {
        if (resetTime) {
        // resume previous progress
        startTime = performance.now() - progress;
        resetTime = false;
        } else {
        progress = timestamp - startTime;
        }

        // restart if it finishes a loop
        if (progress > speedFactor * 360) {
        startTime = timestamp;
        geojson.features[0].geometry.coordinates = [];
        } else {
        const x = progress / speedFactor;
        // draw a sine wave with some math.
        const y = Math.sin((x * Math.PI) / 90) * 40;
        // append new coordinates to the lineString
        geojson.features[0].geometry.coordinates.push([x, y]);
        // then update the map
        map.getSource('line').setData(geojson);
        }
        // Request the next frame of the animation.
        animation = requestAnimationFrame(animateLine);
        }
      });
  }
}
