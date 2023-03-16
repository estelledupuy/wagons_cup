import { Controller } from "@hotwired/stimulus"
import * as mapsgl from '@aerisweather/mapsgl';
// import '@aerisweather/mapsgl/dist/mapsgl.css';

// Connects to data-controller="map"
export default class extends Controller {
  static targets = ['map']

  static values = {
    apiKey: String,
    clientId: String,
    clientSecret: String,
    idRaceValue: Number,
  }

  connect() {
    mapboxgl.accessToken = this.apiKeyValue

    // this.clearRoute = false;

    this.map = new mapboxgl.Map({
      container: this.mapTarget,
      style: 'mapbox://styles/gwenoladlv/clf9shka7002201s0vry3ik33',
      center: [2.3488, 48.85341],
      trackResize: false,
      zoom: 0,
    })

      // this._draw_animated_line();
      // this._draw_animated_line();

      /**
      * Set up your AerisWeather account and access keys for the SDK.
      */
      // const account = new mapsgl.Account(this.clientIdValue, this.clientSecretValue);

      // /**
      // * Create a map controller that corresponds to the selected mapping library, passing in
      // * your `map` and `account` instances.
      // */
      // const controller = new mapsgl.MapboxMapController(this.map, { account });

      // /**
      // * Add functionality and data to your map once the controller's `load` event has been triggered.
      // */
      // controller.on('load', () => {
      //     // do stuff, like add weather layers
      //     //controller.addWeatherLayer('temperatures');
      //     // controller.addWeatherLayer('dew-points');
      //     controller.addWeatherLayer('wind-particles');

      //     const options = {
      //       type: 'move'
      //     }

      //     controller.addDataInspectorControl(options)
      // });

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

  async draw_animated_line(evt) {
    this.clearRoute = true;
    if (this.map.getLayer('trace')) {
      this.map.removeLayer('trace');
    }
    if (this.map.getSource('trace')) {
      this.map.removeSource('trace');
    }
    this.clearRoute = false;

    const response = await fetch(
      `/races/${evt.params.raceId.race_id}/coordinates`
    );
    const data = await response.json();
    //this.map.on('load', () => {
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

      // setup the viewport
      // this.map.jumpTo({ 'center': coordinates[0], 'zoom': 0 });
      // this.map.setPitch(30);

      // on a regular basis, add more coordinates from the saved list and update the map
      let i = 0;
      this.timer = setInterval(() => {
        if (i < coordinates.length) {
        geojson.features[0].geometry.coordinates.push(coordinates[i]);
          this.map.getSource('trace').setData(geojson);
          this.map.panTo(coordinates[i]);
          this.clearRoute ? window.clearInterval(this.timer) : i++;
        } else {
          window.clearInterval(this.timer);
        }
      }, 50);
    //});
  }

  clearIntervalle() {
    window.clearInterval(this.timer)
  }
}
