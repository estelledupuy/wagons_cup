import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="direction"
export default class extends Controller {
  static targets = [ "boatSelector" ];

  connect() {
    console.log('commande controller connected');
  }

  angle(){
    console.log("you clicked the button!");
    this.boatSelectorTarget.style.transform = 'rotate(90deg)';
  }
}
