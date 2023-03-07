import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="windytest"
export default class extends Controller {
  connect() {
  }

  callApi() {
    fetch("https://reqres.in/api/register", {
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
      console.log(data)
    })
  }
}
