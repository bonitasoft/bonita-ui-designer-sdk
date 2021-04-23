"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WcExample = void 0;
var lit_element_1 = require("lit-element");
/**
 * A simple counter component
 */
var WcExample = /** @class */ (function (_super) {
    __extends(WcExample, _super);
    function WcExample() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Main title
         */
        _this.title = 'Hey there';
        /**
         * Count the number of clicks
         */
        _this.counter = 5;
        return _this;
    }
    WcExample.prototype.__increment = function () {
        this.counter += 1;
    };
    WcExample.prototype.render = function () {
        return lit_element_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      <h2>", " Nr. ", "!</h2>\n      <button @click=", ">increment</button>\n    "], ["\n      <h2>", " Nr. ", "!</h2>\n      <button @click=", ">increment</button>\n    "])), this.title, this.counter, this.__increment);
    };
    WcExample.styles = lit_element_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    :host {\n      display: block;\n      padding: 25px;\n      color: var(--wc-example-text-color, #000);\n    }\n  "], ["\n    :host {\n      display: block;\n      padding: 25px;\n      color: var(--wc-example-text-color, #000);\n    }\n  "])));
    __decorate([
        lit_element_1.property({ type: String })
    ], WcExample.prototype, "title", void 0);
    __decorate([
        lit_element_1.property({ type: Number })
    ], WcExample.prototype, "counter", void 0);
    WcExample = __decorate([
        customElement('wc-example')
    ], WcExample);
    return WcExample;
}(lit_element_1.LitElement));
exports.WcExample = WcExample;
var templateObject_1, templateObject_2;
