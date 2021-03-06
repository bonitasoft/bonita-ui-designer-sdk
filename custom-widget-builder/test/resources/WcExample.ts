import { html, css, LitElement, property } from 'lit-element';

/**
 * A simple counter component
 */
@customElement('wc-example')
export class WcExample extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--wc-example-text-color, #000);
    }
  `;

  /**
   * Main title
   */
  @property({ type: String })
  title = 'Hey there';

  /**
   * Count the number of clicks
   */
  @property({ type: Number })
  counter = 5;

  __increment() {
    this.counter += 1;
  }

  render() {
    return html`
      <h2>${this.title} Nr. ${this.counter}!</h2>
      <button @click=${this.__increment}>increment</button>
    `;
  }
}
