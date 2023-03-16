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

  static targets = ["distance-info", "map", "wind", "boatSelector", "jointure", "rain","darrival", "boatspeed", "ddeparture", "averageSpeed", "days"]

  connect() {
    this.windLayer = false
    this.radarLayer = false
    this.precipationsLayer = false
    this.temperaturesLayer = false

    mapboxgl.accessToken = this.apiKeyValue

    this.map = new mapboxgl.Map({
      container: this.mapTarget,
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

    new mapboxgl.Marker()
      .setLngLat([ this.markerEndingLongitudeValue, this.markerEndingLatitudeValue ])
      .addTo(this.map)
  }

  setAeris() {
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
         this.controller.addWeatherLayer('radar')
         this.controller.addWeatherLayer('temperatures-contour')
         this.controller.addWeatherLayer('accum-precip-1hr')

        this.map.setLayoutProperty('wx.wind-particles::conditions.wind.particle', 'visibility', 'none')
        this.map.setLayoutProperty('wx.temperatures-contour::conditions.temperature.contour', 'visibility', 'none')
        this.map.setLayoutProperty('wx.radar::conditions.radar', 'visibility', 'none')
        this.map.setLayoutProperty('wx.accum-precip-1hr::conditions.precip', 'visibility', 'none')

        const options = {
          type: 'move'
        }

        this.controller.addDataInspectorControl(options)
    });
  }

  distanceCalculation(array) {
    var from = turf.point([ this.markerEndingLatitudeValue, this.markerEndingLongitudeValue]);
    var to = turf.point(array);
    var options = {units: 'miles'};
    var distance = turf.distance(from, to, options);
    return distance;
  }

  setCable() {
    this.channel = createConsumer().subscriptions.create(
      { channel: "BoatChannel", id: this.boatIdValue },
      { received: this.refresh.bind(this) }
    )
  }

  refresh(data) {
    this.updateGeoJson(data);
    this.updateDashboard(data);
    this.tiltWithWind(data);
  }

  updateGeoJson(data) {
    const wind_dir = data.wind_dir
    this.jointureTarget.dataset.directionwindirValue = wind_dir
    var coordinates = [data.longitude, data.latitude]
    var distance = this.distanceCalculation(coordinates)
    const geojson = {
      'type': 'FeatureCollection',
      'features': [{
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': coordinates
        }
      }]
    }
    this.map.getSource('dot-point').setData(geojson);
  }

  updateDashboard(data) {
    this.darrivalTarget.innerText =`: ${Math.round(data.arrival_dist)} miles`
    this.ddepartureTarget.innerText = `: ${Math.round(data.departure_dist)} miles`
  }

  tiltWithWind(data) {
    console.log(data)
    const wind_dir = data.wind_dir
    const boat_dir = data.boat_dir
    console.log(wind_dir);
    this.windTarget.style.transform = `rotate(${wind_dir}deg)`;
    const alpha_boat = this.angle(boat_dir, wind_dir);

    this.boatSelectorTarget.style.transform = `rotate(${alpha_boat}deg)`;
  }

  angle(dir, wind) {
     var alphaBoat = 0
     if (dir === 1) {
       alphaBoat = wind + 45 + 0
       }
     if (dir === 2) {
       alphaBoat = wind + 45 + 44
       }
     if (dir === 3) {
       alphaBoat = wind + 45 + 59
       }
     if (dir === 4) {
       alphaBoat = wind + 45 + 90
       }
     if (dir === 5) {
       alphaBoat = wind + 45 + 133
       }
     if (dir === 6) {
       alphaBoat = wind + 45 + 178
       }
     if (dir === 7) {
       alphaBoat = wind + 45 + 225
       }
     if (dir === 8) {
       alphaBoat = wind + 45 + 268
       }
     if (dir === 9) {
       alphaBoat = wind + 45 + 300
       }
     if (dir === 10) {
       alphaBoat = wind + 45 + 315
       }
     return alphaBoat
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

      // Load an image from an external URL.
      this.map.loadImage('https://res.cloudinary.com/dwclozjta/image/upload/v1678870732/bateau_lemon_op5dfw_r7p18j.png', (error, image) => {
      if (error) throw error;
      // Add the loaded image to the style's sprite with the ID 'kitten'.
      this.map.addImage('boat', image);
      });


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
          'icon-image': 'boat',
          'icon-size': 0.05,
          }
      });
  }

  toggleWindLayer() {
    if (this.windLayer) {
      this.map.setLayoutProperty('wx.wind-particles::conditions.wind.particle', 'visibility', 'none')
      this.windLayer = false
      return
    }

    this.map.setLayoutProperty('wx.wind-particles::conditions.wind.particle', 'visibility', 'visible')
    this.windLayer = true
  }


  toggleTemperaturesLayer() {
    if (this.temperaturesLayer) {
      this.map.setLayoutProperty('wx.temperatures-contour::conditions.temperature.contour', 'visibility', 'none')
      this.temperaturesLayer = false
      return
    }

    this.map.setLayoutProperty('wx.temperatures-contour::conditions.temperature.contour', 'visibility', 'visible')
    this.temperaturesLayer = true
  }

  toggleRadarLayer() {
    if (this.radarLayer) {
      this.map.setLayoutProperty('wx.radar::conditions.radar', 'visibility', 'none')
      this.radarLayer = false
      return
    }

    this.map.setLayoutProperty('wx.radar::conditions.radar', 'visibility', 'visible')
    this.radarLayer = true
  }

  togglePrecipitationsLayer() {
    if (this.precipitationsLayer) {
      this.map.setLayoutProperty('wx.accum-precip-1hr::conditions.precip', 'visibility', 'none')
      this.precipitationsLayer = false
      return
    }

    this.map.setLayoutProperty('wx.accum-precip-1hr::conditions.precip', 'visibility', 'visible')
    this.precipitationsLayer = true
  }
}
