/**
 * two-way form-json function
 * Original author: @krhkt
 * Licensed under the MIT license
 */
(function () {
    "use strict";

    let defaultOptions = {
        attr: 'name',
        includeDisabled: false,
        includeHidden: true,
    };

    let inputsReaderWriter = {
        getSelectMultipleValue: (select) => {
            if (!select) return null;

            const options = select.options || [];

            const values = Array.from(options)
                .map(o => o.selected ? o.value : null)
                .filter(v => v !== null);

            return values;
        },

        getCheckableValue: (checkable) => {
            if (!checkable) return null;

            if (!checkable.checked) return '';

            return checkable.value;
        },

        setSelectValue: (select, value = '') => {
            if (!select) return;

            //resetting
            select.value = '';

            if (!Array.isArray(value)) {
                select.value = value;
                return;
            }

            value.forEach(v => {
                const option = select.querySelector(`option[value="${v}"]`);
                if (!option) return;

                option.selected = true;
            });
        },

        //radio or checkbox
        checkCheckableValue: function (checkable, value) {
            if (!Array.isArray(value)) value = [value];

            const values = value.map(e => '' + e);
            if (values.indexOf(checkable.value) === -1) return;

            checkable.checked = true;
        },

        checkCheckboxesValue: function (checkbox, value) {
            Array.from(checkbox).forEach(c => {
                c.checked = false;
                inputsReaderWriter.checkCheckableValue(c, value)
            });
        },

        checkRadiosValue: function (radios, value) {
            radios.prop('checked', false);

            for (i = 0, size = radios.length; i < size; i += 1) {
                if (this.checkCheckableValue(radios.eq(i), ('' + value))) {
                    return true;
                }
            }

            return false;
        },
    };

    let inputsWrapper = {
        key: 'name',

       

        getValue: function (element, options) {

        },

        getValues: function (container, options) {
            const formObject = {};
        
            if (!container) return formObject;

            const { attr, includeDisabled, filter } = options || defaultOptions;

            const elements = container.querySelectorAll('input, select, textarea');
            for (const element of elements) {
                const isDisabled = element.disabled;
                const key = element.getAttribute(attr);

                if (!key || (!includeDisabled && isDisabled)) continue;
                if (Array.isArray(filter) && (filter.indexOf(key) === -1)) continue;

                switch (element.type) {
                    //ignored types
                    case 'button':
                    case 'reset':
                    case 'image':
                    case undefined:
                        break;

                    case 'radio':
                        const value = this._getCheckableValue(element);
                        formObject[key] = formObject[key] || value;
                        break;
                    
                    case 'checkbox':
                        let value = this._getCheckableValue(element);
                        if (!formObject.hasOwnProperty(key) || !value) {
                            formObject[key] = formObject[key] || value;
                            break;
                        }
                        
                        if (!Array.isArray(formObject[key])) {
                            formObject[key] = [formObject[key]];
                        }

                        formObject[key].push(value);
                        break;
                    
                    case 'select-multiple':
                        formObject[key] = this._getSelectMultipleValue(element);
                        break;
                            
                    case 'select-one':
                    default: 
                        formObject[key] = this._getValue(element);
                }
            }

            return formObject;
        },

       

        setValues: function (container, values) {
            var key, nodes, filter, type,
                attr = $.fn.inputValues.opts.attr;

            for (key in values) {
                if (!values.hasOwnProperty(key)) continue;

                filter = '[' + attr + '="' + key + '"]';
                nodes = container.find(filter);

                if (nodes.length === 0) { continue; }

                type = nodes[0].type;

                switch (type) {
                    case 'select-one':
                    case 'select-multiple':
                        this.setSelectValue(nodes, values[key]);
                    break;

                    case 'radio':
                        this.checkRadiosValue(nodes, values[key]);
                    break;

                    case 'checkbox':
                        this.checkCheckboxesValue(nodes, values[key]);
                    break;
                    
                    case 'file':
                        //fileinput can only be setted to empty string
                        if (values[key] !== '') continue;

                        nodes.val('');
                    break;
                    
                    //these types have no setter
                    case 'button':
                    case 'image':
                    case 'reset':
                    case undefined:
                    break;
                    
                    default:
                        nodes.val(values[key]);
                }
            }
        }
    };
    
    //publishing
    $.fn.inputValues = function (paramA, paramB) {
        var values;

        //getting all values from element set
        if (!paramA) return controlsWrapper.getValues(this);

        if (typeof paramA === 'string') {
            //getting only values with the specific name
            if (paramB === undefined) return controlsWrapper.getValues(this, paramA);

            values = {};
            values[paramA] = paramB ;
        } else {
            values = paramA;
        }

        controlsWrapper.setValues(this, values);
        
        return this;
    };

    $.fn.inputValues.opts = {
        attr: 'name',
        includeDisabled: false
    };

    $.fn.inputValues.config = function (opts) {
        $.fn.inputValues.opts = $.extend($.fn.inputValues.opts, opts);

        return this;
    };
}());
