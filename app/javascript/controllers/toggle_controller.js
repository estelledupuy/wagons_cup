import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="toggle"
export default class extends Controller {
  static targets = [ "commandes" ];

  initialize() {
    this.isOpen = false;
  }
  connect() {
    console.log('Hello');
    console.log(this.element);
  }

  menu(){
    console.log("you clicked the button!");
    console.log(this.commandesTarget);
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
