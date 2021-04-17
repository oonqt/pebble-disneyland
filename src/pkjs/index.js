var UI = require('pebblejs/dist/js/ui');
var ajax = require('pebblejs/dist/js/lib/ajax');
var Vector2 = require('pebblejs/dist/js/lib/vector2');
var Feature = require('pebblejs/dist/js/platform/feature');

var loadingCard = new UI.Card({
    status: {
        separator: Feature.round('none', 'dotted')
    },
    title: 'Currently Loading...',
    subtitle: 'Please hold while we fetch the ride times...'
});

var parkSelectionMenu = new UI.Menu({
    sections: [
        {
            
        }
    ]
});

parkSelectionMenu.show();