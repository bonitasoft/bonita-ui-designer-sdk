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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PbText = void 0;
var lit_element_1 = require("lit-element");
var unsafe_html_1 = require("lit-html/directives/unsafe-html");
// @ts-ignore
var style_scss_1 = require("./style.scss");
var lit_translate_1 = require("lit-translate");
var i18n_en = require("./i18n/en.json");
var i18n_es = require("./i18n/es-ES.json");
var i18n_fr = require("./i18n/fr.json");
var i18n_ja = require("./i18n/ja.json");
var i18n_pt = require("./i18n/pt-BR.json");
// Registers i18n loader
lit_translate_1.registerTranslateConfig({
    loader: function (lang) { return Promise.resolve(PbText.getCatalog(lang)); }
});
var PbText = /** @class */ (function (_super) {
    __extends(PbText, _super);
    function PbText() {
        var _this = _super.call(this) || this;
        _this.lang = "en";
        _this.id = "";
        _this.labelHidden = false;
        _this.label = "";
        _this.labelPosition = "top";
        _this.labelWidth = 4;
        _this.text = "";
        // User should take care to sanitize the 'text' content before using this.
        // See e.g. https://github.com/google/closure-library/blob/master/closure/goog/html/sanitizer/htmlsanitizer.js
        _this.allowHTML = false;
        _this.alignment = "left";
        lit_translate_1.listenForLangChanged(function () {
            if (_this.label === "") {
                _this.label = lit_translate_1.get("defaultLabel");
            }
        });
        return _this;
    }
    PbText.prototype.attributeChangedCallback = function (name, old, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                _super.prototype.attributeChangedCallback.call(this, name, old, value);
                if (name === 'lang') {
                    lit_translate_1.use(this.lang).then();
                }
                return [2 /*return*/];
            });
        });
    };
    PbText.getCatalog = function (lang) {
        switch (lang) {
            case "es":
            case "es-ES":
                return i18n_es;
            case "fr":
                return i18n_fr;
            case "ja":
                return i18n_ja;
            case "pt":
            case "pt-BR":
                return i18n_pt;
            default:
                return i18n_en;
        }
    };
    Object.defineProperty(PbText, "styles", {
        get: function () {
            return lit_element_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      :host {\n        display: block;\n        font-family: sans-serif;\n        text-align: left;\n      }\n\n      .label-elem {\n        font-size: 14px;\n        font-weight: 700;\n        padding-left: 0;\n        padding-top: 0;\n      }\n      \n      .paragraph-elem {\n        font-family: \"Helvetica Neue\",Helvetica,Arial,sans-serif;\n        font-size: 14px;\n        line-height: 1.42857143;\n        color: #333;\n        background-color: #fff;\n        margin: 0;\n        padding-left: 0;\n      }\n      \n      .text-center {\n        text-align: center!important;\n      }\n      .text-right {\n        text-align: right!important;\n      }\n    "], ["\n      :host {\n        display: block;\n        font-family: sans-serif;\n        text-align: left;\n      }\n\n      .label-elem {\n        font-size: 14px;\n        font-weight: 700;\n        padding-left: 0;\n        padding-top: 0;\n      }\n      \n      .paragraph-elem {\n        font-family: \"Helvetica Neue\",Helvetica,Arial,sans-serif;\n        font-size: 14px;\n        line-height: 1.42857143;\n        color: #333;\n        background-color: #fff;\n        margin: 0;\n        padding-left: 0;\n      }\n      \n      .text-center {\n        text-align: center!important;\n      }\n      .text-right {\n        text-align: right!important;\n      }\n    "])));
        },
        enumerable: false,
        configurable: true
    });
    PbText.prototype.render = function () {
        return lit_element_1.html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      <style>", "</style>\n      <div id=\"", "\" class=\"container\">\n        <div class=\"row\">\n          ", "\n          <p\n              class=\"", "\"\n          >", "</p>\n        </div>\n      </div>\n    "], ["\n      <style>", "</style>\n      <div id=\"", "\" class=\"container\">\n        <div class=\"row\">\n          ", "\n          <p\n              class=\"", "\"\n          >", "</p>\n        </div>\n      </div>\n    "])), style_scss_1.default, this.id, this.getLabel(), this.getParagraphCssClass(), this.getTextValue());
    };
    PbText.prototype.getTextValue = function () {
        if (this.allowHTML) {
            return lit_element_1.html(templateObject_3 || (templateObject_3 = __makeTemplateObject(["", ""], ["", ""])), unsafe_html_1.unsafeHTML(this.text));
        }
        return lit_element_1.html(templateObject_4 || (templateObject_4 = __makeTemplateObject(["", ""], ["", ""])), this.text);
    };
    PbText.prototype.getLabel = function () {
        if (this.labelHidden) {
            return lit_element_1.html(templateObject_5 || (templateObject_5 = __makeTemplateObject([""], [""])));
        }
        return lit_element_1.html(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n        <label\n          class=\"", "\"\n        >", "</label>\n        "], ["\n        <label\n          class=\"", "\"\n        >", "</label>\n        "])), this.getLabelCssClass(), this.label);
    };
    PbText.prototype.getLabelCssClass = function () {
        return "label-elem form-horizontal col-form-label " +
            (!this.labelHidden && this.labelPosition === 'left' ? "col-" + this.labelWidth + " text-right" : "col-12");
    };
    PbText.prototype.getParagraphCssClass = function () {
        return "form-control-static paragraph-elem " + (this.labelHidden ? "text-" + this.alignment + " " : "") +
            "col";
    };
    __decorate([
        lit_element_1.property({ attribute: 'lang', type: String, reflect: true })
    ], PbText.prototype, "lang", void 0);
    __decorate([
        lit_element_1.property({ attribute: 'id', type: String, reflect: true })
    ], PbText.prototype, "id", void 0);
    __decorate([
        lit_element_1.property({ attribute: 'label-hidden', type: Boolean, reflect: true })
    ], PbText.prototype, "labelHidden", void 0);
    __decorate([
        lit_element_1.property({ attribute: 'label', type: String, reflect: true })
    ], PbText.prototype, "label", void 0);
    __decorate([
        lit_element_1.property({ attribute: 'label-position', type: String, reflect: true })
    ], PbText.prototype, "labelPosition", void 0);
    __decorate([
        lit_element_1.property({ attribute: 'label-width', type: String, reflect: true })
    ], PbText.prototype, "labelWidth", void 0);
    __decorate([
        lit_element_1.property({ attribute: 'text', type: String, reflect: true })
    ], PbText.prototype, "text", void 0);
    __decorate([
        lit_element_1.property({ attribute: 'allow-html', type: Boolean, reflect: true })
    ], PbText.prototype, "allowHTML", void 0);
    __decorate([
        lit_element_1.property({ attribute: 'alignment', type: String, reflect: true })
    ], PbText.prototype, "alignment", void 0);
    PbText = __decorate([
        lit_element_1.customElement('pb-text')
    ], PbText);
    return PbText;
}(lit_element_1.LitElement));
exports.PbText = PbText;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
