/**
 * @element bottom-button
 */
class BottomButton extends Polymer.Element {
    static get is() { return 'bottom-button'; }

    static get properties() {
        return {
            /**
             * Define the border of the button
             */
            border: {
                type: Boolean,
                reflectToAttribute: true,
                value: false
            }
        };
    }

    _setClass(border) {
        return border ? 'border' : 'monochrome';
    }
}

