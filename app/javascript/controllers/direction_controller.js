import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="direction"
export default class extends Controller {
  static targets = [ "boatSelector" ];
  static values = {
    windir: Number
  }

  connect() {
    console.log('commande controller connected');
  }

  angle(event) {
     console.log(event.currentTarget.attributes.id.value);
     const id = event.currentTarget.attributes.id.value;
     var alphaBoat = 0
     if (id==="a1") {
       alphaBoat = this.windirValue + 45 + 0
       }
     if (id==="a2") {
       alphaBoat = this.windirValue + 45 - 1
       }
     if (id==="a3") {
       alphaBoat = this.windirValue + 45 + 59
       }
     if (id==="a4") {
       alphaBoat = this.windirValue + 45 + 90
       }
     if (id==="a5") {
       alphaBoat = this.windirValue + 45 + 133
       }
     if (id==="a6") {
       alphaBoat = this.windirValue + 45 + 178
       }
     if (id==="a7") {
       alphaBoat = this.windirValue + 45 + 225
       }
     if (id==="a8") {
       alphaBoat = this.windirValue + 45 + 268
       }
     if (id==="a9") {
       alphaBoat = this.windirValue + 45 + 300
       }
     if (id==="a10") {
       alphaBoat = this.windirValue + 45 + 315
       }
      console.log(alphaBoat)
     this.boatSelectorTarget.style.transform = `rotate(${alphaBoat}deg)`
    //  pass on "direction" to update of boat >> via submit form (input.value = ...)
  }
}
