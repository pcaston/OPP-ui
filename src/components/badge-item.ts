import { LitElement, html, property, customElement } from 'lit-element';

@customElement('badge-item')
export class BadgeItem extends LitElement {
  @property() id: string = '';
  @property() name: string = '';
  @property() type: string = '';
  @property() usage: number = 0;
  @property() cost: string = '';

  protected render() {
    return html`
      id:
      ${this.id}
      name:
      ${this.name}
      type:
      ${this.type}
      <span ?hidden="${this.usage === 0}">usage:${this.usage} kwh </span>
      cost:
      $${this.cost}
      </span>
    `;
  }
}
