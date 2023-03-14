import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="direction"
export default class extends Controller {
  connect() {

    console.log('commande controller connected');
  }
}
