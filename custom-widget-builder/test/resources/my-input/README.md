# `my-input`

![npmVersion](https://img.shields.io/npm/v/my-input?color=blue&style=plastic)

Simple input web component

## Attributes

| Attribute        | Type      | Default | Possible values    |
|------------------|-----------|---------|--------------------|
| `id`             | `string`  | ""      |                    |
| `label`          | `string`  | ""      |                    |
| `label-hidden`   | `boolean` | false   |                    |
| `label-position` | `string`  | "top"   | left top           |
| `label-width`    | `string`  | "4"     |                    |
| `lang`           | `string`  | "en"    |en es-ES fr ja pt-BR|
| `max`            | `string`  | ""      |                    |
| `max-length`     | `string`  | ""      |                    |
| `min`            | `string`  | ""      |                    |
| `min-length`     | `string`  | ""      |                    |
| `placeholder`    | `string`  | ""      |                    |
| `readonly`       | `boolean` | false   |                    |
| `required`       | `boolean` | false   |                    |
| `step`           | `string`  | "1"     |                    |
| `type`           | `string`  | "text"  |                    |
| `value`          | `string`  | ""      |                    |


## Events

| Event         | Type                  |
|---------------|-----------------------|
| `valueChange` | `CustomEvent<string>` |

## Usage

Run:

    npm install my-input

Then import `node_modules/my-input/lib/my-input.es5.min.js`

And you can use new html tag `<my-input placeholder="Type a value"></my-input>`
