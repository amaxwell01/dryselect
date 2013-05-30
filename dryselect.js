(function(window, document, $, undefine) {

    var defaultSettings = {
        checkbox: '<input type=checkbox />'
    };

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

            if ( args ) {
                userSettings = args;
            }

            if ( userSettings.name ) {
                userSettings.element = $('[data-name="' + args.name + '"]');
                userSettings.element.attr('id', (args.name + '_container') );
            }

            // Update the selectable values to the new DOM
            listItems = self.newSelectDOM();
            newValues = '<ol class="dryselect_list_container">' + listItems + '</ol>';

            userSettings.element.append( newValues );

            self.enableSelection( args.name );
        },

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
            var dryselectContainer = $('#' + name + '_container');
            var selectOptions = dryselectContainer.find('li');
            var selectOptionsCheckbox = dryselectContainer.find('li').find('input[type="checkbox"]');

            selectOptions.off('click');
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

            selectOptionsCheckbox.off('click');
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
        },

        newSelectDOM: function() {
            var newValues = '';
            var checkbox = '';

            if ( userSettings.values ) {
                $.each( userSettings.values, function(key, value) {
                    if ( userSettings.checkboxes ) {
                        checkbox = '<input type="checkbox" name="' + value.title + '" value="' + value.value + '"">';
                    }

                    newValues += '<li class="' + value.itemClass + '" id="' + value.itemID + '" data-value="' + value.value + '">' + checkbox + '<span>' + value.title + '</span></li>';
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
                        if ( $(value).attr('data-value') === args.values[key] ) {
                            $(value).addClass('selected');
                            $(value).find('input[type="checkbox"]').prop('checked', true);
                        }
                    });
                }
            } else {
                console.log( 'no values specified' );
            }
        }
    };

    window.dryselect = dryselect;
})(window, document, jQuery);