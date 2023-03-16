import { Color, DataQuality } from "@aerisweather/mapsgl";
import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="direction"
export default class extends Controller {

  static targets = [ "boatSelector", "wind", "input", "form", "fill", "allure" ];

  static values = {
    windir: Number,
    boatId: Number
  }

  connect() {
    console.log('commande controller connected');
    this.token = document.querySelector('meta[name="csrf-token"]').content
  }

  async angle(event) {
    document.querySelectorAll('.fill').forEach((item) => {
      item.classList.remove('fill')
    })

    const section = document.querySelector(`#Section_${event.params.section} path`)
    section.classList.add('fill')

     console.log(event.currentTarget.attributes.id.value);
     const id = event.currentTarget.attributes.id.value;
     var alphaBoat = 0
     var messageDirection = ""
     if (id==="a1") {
       alphaBoat = this.windirValue + 45 + 0
       messageDirection ="Vent de face"
       }
     if (id==="a2") {
       alphaBoat = this.windirValue + 45 + 44
       messageDirection ="Prés"
       }
     if (id==="a3") {
       alphaBoat = this.windirValue + 45 + 59
       messageDirection ="Bon plein"
       }
     if (id==="a4") {
       alphaBoat = this.windirValue + 45 + 90
       messageDirection ="Travers"
       }
     if (id==="a5") {
       alphaBoat = this.windirValue + 45 + 133
       messageDirection ="Grand largue"
       }
     if (id==="a6") {
       alphaBoat = this.windirValue + 45 + 178
       messageDirection ="Vent arrière"
       }
     if (id==="a7") {
       alphaBoat = this.windirValue + 45 + 225
       messageDirection ="Grand largue"
       }
     if (id==="a8") {
       alphaBoat = this.windirValue + 45 + 268
       messageDirection ="Travers"
       }
     if (id==="a9") {
       alphaBoat = this.windirValue + 45 + 300
       messageDirection ="Bon plein"
       }
     if (id==="a10") {
       alphaBoat = this.windirValue + 45 + 315
       messageDirection ="Prés"
       }

      console.log(alphaBoat)
     this.windTarget.style.transform = `rotate(${this.windirValue }deg)`
     this.boatSelectorTarget.style.transform = `rotate(${alphaBoat}deg)`
     this.inputTarget.value = event.currentTarget.dataset.value
     this.allureTarget.innerHTML = messageDirection

     const options = {
      method: 'PATCH',
      headers: { accept: 'application/json', 'X-CSRF-TOKEN': this.token },
      body: new FormData(this.formTarget)
     }


     const response = await fetch(`/boats/${this.boatIdValue}`, options)
     const data = await response.json();

    //  pass on "direction" to update of boat >> via submit form (input.value = ...)

  }
  color() {
    console.log('hello');
    const elem = document.querySelector(".fill");
    if (elem) {
      this.elem.classList.remove('fill')
      this.fillTarget.classList.add('fill')
    }
    else {
      this.fillTarget.classList.add('fill')
    }
  }
}
