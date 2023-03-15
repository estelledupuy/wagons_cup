import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="direction"
export default class extends Controller {
  connect() {

    console.log('commande controller connected');
  }

  rotateBoat(event) {
    console.log(event.currentTarget.attributes.id);
    if (id="a1") {
      alpha_boat = @wind_dir + 45 + 0
      }
    if (id="a2") {
      alpha_boat = @wind_dir + 45 - 1
      }
    if (id="a3") {
      alpha_boat = @wind_dir + 45 + 59
      }
    if (id="a4") {
      alpha_boat = @wind_dir + 45 + 90
      }
    if (id="a5") {
      alpha_boat = @wind_dir + 45 + 133
      }
    if (id="a6") {
      alpha_boat = @wind_dir + 45 + 178
      }
    if (id="a7") {
      alpha_boat = @wind_dir + 45 + 225
      }
    if (id="a8") {
      alpha_boat = @wind_dir + 45 + 268
      }
    if (id="a9") {
      alpha_boat = @wind_dir + 45 + 300
      }
    if (id="a10") {
      alpha_boat = @wind_dir + 45 + 315
      }
    this.boatSelectorTarget.transform = `rotate(${alpha_boat}deg)`
    // pass on "direction" to update of boat >> via submit form (input.value = ...)
  }
}
