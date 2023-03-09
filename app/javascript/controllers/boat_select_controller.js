import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="boat-select"
export default class extends Controller {
  static targets = ['img']

  connect() {
  }

  async update(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    console.log('hello')
    const color = evt.target.value
    const response = await fetch(`/boat_select?color=${color}`)
    const data = await response.json()

    this.imgTarget.src = data.url
  }
}
