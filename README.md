# INPUT VALUES
jQuery plugin to get and set values to form inputs using JSON. [Try it out](https://krhkt.github.io/jquery-input-values/jquery-input-values-demo.html).

### 1. Interface
The plugin uses the current jquery node set as the containers of all `input`, `textarea`, and `select` elements. However, only elements containing a `[name]` attribute (or other attribute specified by options) will be included as part of getting/setting process. It works for all input types, including radio and checkboxes, as well as textareas, selects, and multiple selects. For a live demo, download the code and open the file `jquery-input-values-demo.html`.
```js
//plugin method
$( ... ).inputValues(...);

//config method
$().inputValues.config(opts);
```

### 2. Getting values
```js 
.inputValues([keyName])
```
`keyName` is an optional `string` parameter that must match the value of the attribute `[name]`, or another attribute specified by options.

Getting all values:
```js
var values = $('.form').inputValues();

//values = { inputTextName: 'input text value', selectName: 'selet value', ...}
```

Getting a single value:
```js
var value = $('.form').inputValues('inputTextName');

//value = 'input text value'
```

### 3. Setting values
```js
.inputValues(valuesObject); //chainable
.inputValues(key, value);   //chainable
```

Setting all values:
```js
$('.form').inputValues({
    inputTextName: 'new input text value',
    selectName: 'new select value'
});
```

Setting single value:
```js
$('.form').inputValues('inputTextName', 'new value');
```

### 4. Options
There are two options that can be used to configure the plugin behavior:
- `includeDisabled`: will include disabled inputs when getting values
- `attr`: specifies the attribute that will be used as the key to match the elements of the form. The default is set to `name`, and the supported attrs are: `name`, `id`, `data-{custom}`. There's no support for using classes or complex queries as match for the inputs
```js
//configuring the plugin
$().inputValues.config({
    attr: 'id', //defaults to 'name',
    includeDisabled: true //defaults to false
});
```
