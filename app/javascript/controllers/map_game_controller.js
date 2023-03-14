import { Controller } from "@hotwired/stimulus"
import * as mapsgl from '@aerisweather/mapsgl';
import { createConsumer } from "@rails/actioncable"
// import '@aerisweather/mapsgl/dist/mapsgl.css';

// Connects to data-controller="map"
export default class extends Controller {
  static values = {
    apiKey: String,
    clientId: String,
    clientSecret: String,
    boatLongitude: Number,
    boatLatitude: Number,
    markerStartLatitude: Number,
    markerStartLongitude: Number,
    markerEndingLatitude: Number,
    markerEndingLongitude: Number,
    markerEndingIconUrl: String,
    boatId: Number,
  }
  static targets = ["distance-info"]

  connect() {
    mapboxgl.accessToken = this.apiKeyValue


    var from = turf.point([-75.343, 39.984]);
          var to = turf.point([-75.534, 39.123]);
          var options = {units: 'miles'};
          var distance = turf.distance(from, to, options);
          console.log("distance", distance);

    this.map = new mapboxgl.Map({
      container: this.element,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [2.3488, 48.85341],
      zoom: 0,
    })


    this.setCable();
    this.setAeris();
    this.addMarkerOnMap();

    this.map.on('load', () => {
      this.addPointOnMap();
    })
  }


  addMarkerOnMap() {
    new mapboxgl.Marker()
      .setLngLat([ this.markerStartLongitudeValue, this.markerStartLatitudeValue ])
      .addTo(this.map)

    // Create a HTML element for your custom marker
    const customEndingMarker = document.createElement("img")
    customEndingMarker.src = this.markerEndingIconUrlValue

    new mapboxgl.Marker(customEndingMarker)
      .setLngLat([ this.markerEndingLongitudeValue, this.markerEndingLatitudeValue ])
      .addTo(this.map)
  }

  setAeris() {
    console.log('aeris')
    /**
    * Set up your AerisWeather account and access keys for the SDK.
    */
     const account = new mapsgl.Account(this.clientIdValue, this.clientSecretValue);

     /**
     * Create a map controller that corresponds to the selected mapping library, passing in
     * your `map` and `account` instances.
     */
     this.controller = new mapsgl.MapboxMapController(this.map, { account });

     /**
     * Add functionality and data to your map once the controller's `load` event has been triggered.
     */
     this.controller.on('load', () => {
       this.controller.addWeatherLayer('wind-particles', {
         paint: {
             particle: {
                 count: Math.pow(150, 2), // using a power of two, e.g. 65536
                 size: 1,
                 speed: 1,
                 trailsFade: 0.93,
                 dropRate: 0.005
               }
             }
         });

      const options = {
        type: 'move'
      }
      this.controller.addDataInspectorControl(options)
    });
  }

  setCable() {
    this.channel = createConsumer().subscriptions.create(
      { channel: "BoatChannel", id: this.boatIdValue },
      { received: this.updateGeoJson.bind(this) }
    )
  }

  updateGeoJson(data) {
    const trace = data.trace
    console.log(trace)
    const coordinate = [data.longitude, data.latitude]

    const geojson = {
      'type': 'FeatureCollection',
      'features': [{
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': coordinate
        }
      }]
    }

    this.map.getSource('dot-point').setData(geojson);

    const geojson2 = {
      'type': 'FeatureCollection',
      'features': [{
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': trace
        }
      }]
    }

    if (this.map.getLayer('trace')) {
        console.log('hello')
        this.map.removeLayer('trace')
        this.map.getSource('trace').setData(geojson2);
        this.map.addLayer('trace')
    } else {
      console.log('coucou')
      this.map.addSource('trace', { type: 'geojson', data: geojson2 });
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
    }

    // setup the viewport
    //map.jumpTo({ 'center': coordinates[0], 'zoom': 14 });
    //map.setPitch(30);
    geojson2.features[0].geometry.coordinates = [coordinates[0]];
    // on a regular basis, add more coordinates from the saved list and update the map
    let i = 0;
    const timer = setInterval(() => {
      if (i < trace.length) {
          console.log('ligne')
          geojson2.features[0].geometry.coordinates.push(trace[i]);
          this.map.getSource('trace').setData(geojson2);
          this.map.panTo(trace[i]);
        i++;
      } else {
          console.log('ciao')
          window.clearInterval(timer);
      }
    }, 10);
  }

  addPointOnMap() {
    const size = 100;
    var that = this
    // This implements `StyleImageInterface`
    // to draw a pulsing dot icon on the map.
    const pulsingDot = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      // When the layer is added to the map,
      // get the rendering context for the map canvas.
      onAdd: function () {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
      },

      // Call once before every frame where the icon will be used.
      render: function () {
        const duration = 1000;
        const t = (performance.now() % duration) / duration;

        const radius = (size / 2) * 0.3;
        const outerRadius = (size / 2) * 0.7 * t + radius;
        const context = this.context;

        // Draw the outer circle.
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          outerRadius,
          0,
          Math.PI * 2
        );
        context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
        context.fill();

        // Draw the inner circle.
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          radius,
          0,
          Math.PI * 2
        );
        context.fillStyle = 'rgba(255, 100, 100, 1)';
        context.strokeStyle = 'white';
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // Update this image's data with data from the canvas.
        this.data = context.getImageData(
          0,
          0,
          this.width,
          this.height
        ).data;

        // Continuously repaint the map, resulting
        // in the smooth animation of the dot.
        that.map.triggerRepaint();

        // Return `true` to let the map know that the image was updated.
        return true;
      }
    };

      this.map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
      // setup the viewport
      setTimeout(() => {
        this.map.jumpTo({ 'center': [this.boatLongitudeValue, this.boatLatitudeValue] , 'zoom': 3 });
        // this.map.setPitch(30);
      }, 2000)

      this.map.addSource('dot-point', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': [
            {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [this.boatLongitudeValue, this.boatLatitudeValue] // icon position [lng, lat]
              }
            }
          ]
        }
      });

      this.map.addLayer({
        'id': 'layer-with-pulsing-dot',
        'type': 'symbol',
        'source': 'dot-point',
        'layout': {
          'icon-image': 'pulsing-dot'
          }
      });
  }

  addMeteoLayerTemperature() {
    if (this.controller.getLayer('temperatures-contour')) {
      this.controller.removeLayer('temperatures-contour')
    } else {
      this.controller.addWeatherLayer('temperatures-contour')
    }
  }

  addMeteoLayerRadar() {
    if (this.controller.getLayer('radar')) {
        this.controller.removeLayer('radar')
      } else {
        this.controller.addWeatherLayer('radar')
      }
  }

  addMeteoLayerPrecipitations() {
    if (this.controller.getLayer('accum-precip-1hr')) {
        this.controller.removeLayer('accum-precip-1hr')
      } else {
        this.controller.addWeatherLayer('accum-precip-1hr')
      }
  }
}
