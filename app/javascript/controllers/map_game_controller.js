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
    boatId: Number,
  }

  connect() {
    mapboxgl.accessToken = this.apiKeyValue
    this.channel = createConsumer().subscriptions.create(
      { channel: "BoatChannel", id: this.boatIdValue },
      { received: data => console.log(data) }
    )
    console.log(`Subscribe to the chatroom with the id ${this.boatIdValue}.`)

    // this.clearRoute = false;

    this.map = new mapboxgl.Map({
      container: this.element,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [2.3488, 48.85341],
      zoom: 0,
    })



      /**
      * Set up your AerisWeather account and access keys for the SDK.
      */
      const account = new mapsgl.Account(this.clientIdValue, this.clientSecretValue);

      /**
      * Create a map controller that corresponds to the selected mapping library, passing in
      * your `map` and `account` instances.
      */
      const controller = new mapsgl.MapboxMapController(this.map, { account });

      /**
      * Add functionality and data to your map once the controller's `load` event has been triggered.
      */
      controller.on('load', () => {
        controller.addWeatherLayer('wind-particles', {
          paint: {
              // sample: {
              //     colorscale: {
              //         normalized: true,
              //         stops: [
              //             0, '#f5f5f5',
              //             0.25, '#f5f5f5',
              //             0.5, '#f5f5f5',
              //             0.75, '#f5f5f5',
              //             1, '#f5f5f5',
              //           ]
              //         }
              //     },
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
          controller.addDataInspectorControl(options)
       });
    this.addPointOnMap();

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

    this.map.on('load', () => {
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
    });
  }
}
