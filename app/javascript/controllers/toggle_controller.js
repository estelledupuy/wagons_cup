import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="toggle"
export default class extends Controller {
  static targets = [ "commandes" ];

  initialize() {
    this.isOpen = false;
  }
  connect() {
  }

  menu(){
    this.isOpen ? this.hide() : this.show();
    this.isOpen = !this.isOpen;
  }

  show() {
    this.commandesTarget.style.display = "block";
  }

  hide() {
    this.commandesTarget.style.display = "none";
  }
}
