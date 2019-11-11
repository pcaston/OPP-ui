import { LitElement, html, css, property, customElement } from 'lit-element';

// These are the elements needed by this element.
import './appliance-item';

// These are the elements needed by this element.
import { addToCartIcon } from './my-icons';

// These are the shared styles needed by this element.
import { ButtonSharedStyles } from './button-shared-styles';

export interface Appliances {
  [index: number]: Appliance;
}
export interface Appliance {
  id: string; name: string; type: string;
  usage: {value: number; unit: string};
  cost: {currency: string; value: number};
}

@customElement('appliance-list')
export class ShopAppliances extends LitElement {

  @property({type: Object})
  private appliances: Appliances = {};

  static get styles() {
    return [
      ButtonSharedStyles,
      css`
        :host {
          display: block;
        }
      `
    ];
  }

  protected render() {
    return html`
      ${Object.keys(this.appliances).map((key) => {
        const item = this.appliances[key];
        return html`
          <div>
            <appliance-item id="${item.id}" name="${item.name}" type="${item.type}" 
                usage="${item.usage.value}" cost="${item.cost.value}"></appliance-item>
            <button
                .disabled="${item.usage.value === 0}"
                @click="${this._reduceUsage}"
                data-index="${item.id}"
                name="${item.usage.value === 0 ? 'Not used' : 'Reduce Usage' }">
              ${item.usage.value === 0 ? 'Not used': addToCartIcon }
            </button>
          </div>
        `;
      })
    }
    `;
  }
  
  private _reduceUsage(event: { currentTarget: { dataset: { [x: string]: any; }; }; }) {
    this.dispatchEvent(new CustomEvent("reduceUsage",
        {bubbles: true, composed: true, detail:{item:event.currentTarget.dataset['index']}}));
  }
}