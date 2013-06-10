(function(window, document, $, undefine) {

    var userSettings;

    // Safety net for browsers that don't support Array.isArray()
    if(!Array.isArray) {
        Array.isArray = function (vArg) {
            return Object.prototype.toString.call(vArg) === "[object Array]";
        };
    }

    var dryselect = {

        create: function( args ) {
            var self = this;
            var newValues;
            var listItems;

            var defaultSettings = {
                checkbox: '<input type=checkbox />',
                enabled: true
            };

            if ( args ) {
                userSettings = $.extend(defaultSettings, args);
            }

            if ( userSettings.name ) {
                userSettings.element = $('[data-dryname="' + userSettings.name + '"]');
                userSettings.element.attr('id', (userSettings.name + '_container') );
                self.collection[ userSettings.name ] = userSettings;
            }

            // Update the selectable values to the new DOM
            listItems = self.newSelectDOM( userSettings.name );
            newValues = '<ol class="dryselect_list_container">' + listItems + '</ol>';

            userSettings.element.append( newValues );
            self.enableSelection( userSettings.name );

            // @TODO needs more work and thought
            //self.getSelectionCoords();
        },

        // Store all models in the collection
        collection: {},

        count: function( args ) {
            var dryselectContainer = $('#' + args.name + '_container');
            var selectOptions = dryselectContainer.find('li.selected');
            var count = 0;
            var i = 0;

            for ( i = 0; i < selectOptions.length; i++ ) {
                count++;
            }

            return count;
        },

        enableSelection: function( name ) {
            var currentCollection = dryselect.collection[ name ];
            var selectOptions = currentCollection.element.find('li');
            var selectOptionsCheckbox = currentCollection.element.find('li').find('input[type="checkbox"]');

            selectOptions.off('click');
            selectOptionsCheckbox.off('click');

            if ( currentCollection.enabled ) {
                selectOptions.removeClass('disabled');
                selectOptionsCheckbox.prop('disabled', false);
                selectOptions.on('click', function() {
                    var checked = $(this).find('input[type="checkbox"]').prop('checked');

                    if ( checked ) {
                        $(this).removeClass('selected');
                        $(this).find('input[type="checkbox"]').prop('checked', false);
                    } else {
                        $(this).addClass('selected');
                        $(this).find('input[type="checkbox"]').prop('checked', true);
                    }
                });

                selectOptionsCheckbox.on('click', function() {
                    var checked = $(this).prop('checked');

                    if ( checked ) {
                        $(this).parents('li').removeClass('selected');
                        $(this).prop('checked', false);
                    } else {
                        $(this).parents('li').addClass('selected');
                        $(this).prop('checked', true);
                    }
                });
            } else {
                selectOptions.addClass('disabled');
                selectOptionsCheckbox.prop('disabled', true);
            }
        },

        // Get the values, both selected and non-selected in an object
        get: function(args) {
            $.extend(true, dryselect.collection[ args.name ], args);
            var currentCollection = dryselect.collection[ args.name ];
            var dryselectContainer = currentCollection.element;
            var selectOptions = dryselectContainer.find('li');
            var items = {
                selected: [],
                non_selected: [],
                all: []
            };
            var item;

            // Loop over all of the items, and store it into the items object
            $.each(selectOptions, function(key, value) {
                item = $(value);

                if ( item.hasClass('selected') ) {
                    items.all.push({
                        selected: true,
                        title: item.text(),
                        value: item.attr('data-value')
                    });
                    items.selected.push({
                        value: item.attr('data-value'),
                        title: item.text()
                    });
                } else {
                    items.all.push({
                        selected: false,
                        title: item.text(),
                        value: item.attr('data-value')
                    });
                    items.non_selected.push({
                        value: item.attr('data-value'),
                        title: item.text()
                    });
                }
            });

            return items;
        },

        getSelectionCoords: function() {
            var selection = document.selection, range;
            var selectionCoords;
            var x = 0;
            var y = 0;

            if (selection) {
                if (selection.type != 'Control') {
                    range = selection.createRange();
                    range.collapse(true);
                    x = range.boundingLeft;
                    y = range.boundingTop;
                }
            } else if (window.getSelection) {
                selection = window.getSelection();
                if (selection.rangeCount) {
                    range = sel.getRangeAt(0).cloneRange();
                    if (range.getClientRects) {
                        range.collapse(true);
                        var rect = range.getClientRects()[0];
                        x = rect.left;
                        y = rect.top;
                    }
                }
            }

            selectionCoords = { x: x, y: y };
            console.log( selectionCoords );

            return selectionCoords;
        },

        newSelectDOM: function( name ) {
            var currentCollection = dryselect.collection[ name ];
            var newValues = '';
            var checkbox = '';
            var itemValue;
            var itemTitle;

            if ( currentCollection.values ) {
                $.each( currentCollection.values, function(key, value) {

                    if ( currentCollection.valueMapping ) {
                        itemValue = value[ currentCollection.valueMapping.value ];
                        itemTitle = value[ currentCollection.valueMapping.title ];
                    } else {
                        itemValue = value.value;
                        itemTitle = value.title;
                    }

                    if ( currentCollection.checkboxes ) {
                        checkbox = '<input type="checkbox" name="' + itemTitle + '" value="' + itemValue + '">';
                    }

                    newValues += '<li class="' + value.itemClass + '" id="' + value.itemID + '" data-value="' + itemValue + '">' + checkbox + '<span class="title">' + itemTitle + '</span></li>';
                });
            } else {
                // take the child contents and turn that into the new DOM
                // @TODO See if I only want to select <option> and <li> elements
            }

            return newValues;
        },

        select: function( args ) {
            var dryselectContainer = $('#' + args.name + '_container');
            var selectOptions = dryselectContainer.find('li');

            var checkMatch = function(key, value) {
                $.each( args.values, function(newKey, newValue) {
                    if ( $(value).attr('data-value') === newValue ) {
                        $(value).addClass('selected');
                        $(value).find('input[type="checkbox"]').prop('checked', true);
                    }
                });
            };

            if ( args.values ) {
                if ( args.values === 'all' ) {
                    $.each(selectOptions, function(key, value) {
                        $(value).addClass('selected');
                        $(value).find('input[type="checkbox"]').prop('checked', true);
                    });
                }
                else
                if ( args.values === 'none' ) {
                    $.each(selectOptions, function(key, value) {
                        $(value).removeClass('selected');
                        $(value).find('input[type="checkbox"]').prop('checked', false);
                    });
                }
                else
                if ( Array.isArray(args.values) ) {
                    $.each(selectOptions, function(key, value) {
                        checkMatch(key, value);
                    });
                }
            } else {
                console.log( 'no values specified' );
            }
        },

        set: function(args) {
            var self = this;
            //var dryselectContainer = $('#' + args.name + '_container');
            $.extend(true, dryselect.collection[ args.name ], args);
            var currentCollection = dryselect.collection[ args.name ];
            var dryselectContainer = currentCollection.element;
            var selectOptions = dryselectContainer.find('li');
            var item;
            var itemValue;
            var itemTitle;

            var updateListItem = function( itemValue, newItemTitle, newItemValue ) {

                // Loop over the items, and only change what's needed
                if ( itemValue && newItemTitle ) {
                    $.each(selectOptions, function(key, value) {
                        item = $(value);

                        if ( item.attr('data-value') === itemValue ) {

                            // Update the title value with the new title value
                            item.find('input[type="checkbox"]').attr( 'name', newItemTitle );
                            item.find('.title').text( newItemTitle );

                            if ( newItemValue ) {
                                item.find('input[type="checkbox"]').val( newItemValue );
                                item.attr('data-value', newItemValue);
                            }
                        }
                    });
                }
            };

            self.enableSelection( currentCollection.name );

            if ( currentCollection.values && Array.isArray(currentCollection.values) ) {

                // Loop over the items, and only change what's needed
                $.each(currentCollection.values, function(key, value) {
                    if ( currentCollection.valueMapping ) {
                        itemValue = value[ currentCollection.valueMapping.value ];
                        itemTitle = value[ currentCollection.valueMapping.title ];
                    } else {
                        itemValue = value.value;
                        itemTitle = value.title;
                    }

                    updateListItem( itemValue.toString(), itemTitle, value.newValue );
                });
            }
        }
    };

    window.dryselect = dryselect;
})(window, document, jQuery);