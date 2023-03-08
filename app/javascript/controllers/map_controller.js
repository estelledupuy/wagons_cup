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
      zoom: 0
    })

    // this._draw_animated_line();
    this._draw_animated_line();
  }

  async _draw_line() {
    const response = await fetch(`/races/1/coordinates`)
    const data = await response.json()

    this.map.on('load', () => {
      this.map.addSource('route', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
          'type': 'LineString',
          'coordinates': data
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

      this.map.flyTo({
        center: data[0]
      });
    });
  }

  async _draw_animated_line() {
    const response = await fetch(
      `/races/19/coordinates`
    );
    const data = await response.json();
    this.map.on('load', () => {
      // We fetch the JSON here so that we can parse and use it separately
      // from GL JS's use in the added source.
      // save full coordinate list for later

      const coordinates = data.map( coords => coords.map(coord => parseFloat(coord)) )
      const geojson = {
        'type': 'FeatureCollection',
        'features': [{
          'type': 'Feature',
          'geometry': {
            'type': 'LineString',
            'coordinates': coordinates
          }
        }]
      }
      // // start by showing just the first coordinate
      geojson.features[0].geometry.coordinates = [coordinates[0]];
      // // add it to the map
      this.map.addSource('trace', { type: 'geojson', data: geojson });
      this.map.addLayer({
        'id': 'trace',
        'type': 'line',
        'source': 'trace',
        'paint': {
          'line-color': 'red',
          'line-opacity': 0.75,
          'line-width': 3,
        }
      });

      console.log(coordinates[0])

      // setup the viewport
      this.map.jumpTo({ 'center': coordinates[0], 'zoom': 14 });
      this.map.setPitch(30);

      // on a regular basis, add more coordinates from the saved list and update the map
      let i = 0;
      const timer = setInterval(() => {
        if (i < coordinates.length) {
        geojson.features[0].geometry.coordinates.push(coordinates[i]);
          this.map.getSource('trace').setData(geojson);
          this.map.panTo(coordinates[i]);
          i++;
        } else {
          window.clearInterval(timer);
        }
      }, 1000);
    });
  }
}
