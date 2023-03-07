import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="windytest"
export default class extends Controller {
  static targets = ["wind_u", "wind_v"]
  connect() {
  }

  callApiWind() {
    fetch("https://api.windy.com/api/point-forecast/v2", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      "lat": 49.809,
      "lon": 16.787,
      "model": "gfs",
      "parameters": ["wind"],
      "levels": ["surface"],
      "key": "zIF8phEbm4bn3uvRBV8XPXGcnpAX04vL",
      })
    })
    .then(response => response.json())
    .then((data) => {
      console.log(data);
      this.wind_uTarget.innerText = data["wind_u-surface"][0];
    })
  }

  // callApiMap() {
  //   fetch("", {
  //   method: "POST",
  //   headers: {"Content-Type": "application/json"},
  //   body: JSON.stringify({
  //     "lat": 49.809,
  //     "lon": 16.787,
  //     "model": "gfs",
  //     "parameters": ["wind"],
  //     "levels": ["surface"],
  //     "key": "zIF8phEbm4bn3uvRBV8XPXGcnpAX04vL",
  //     })
  //   })
  //   .then(response => response.json())
  //   .then((data) => {
  //     console.log(data);
  //     this.wind_uTarget.text = data["wind_u-surface"][0];

  //   })
  // }
}
