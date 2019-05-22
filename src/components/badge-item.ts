import { LitElement, html, property, customElement } from 'lit-element';

@customElement('badge-item')
export class BadgeItem extends LitElement {
  @property({type: String}) id = '';

  @property({type: String}) name = '';

  @property({type: String}) type = '';

  @property({type: Number}) usage = 0;

  @property({type: String}) cost = '';

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
