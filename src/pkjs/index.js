require('pebblejs');
var UI = require('pebblejs/ui');
var ajax = require('pebblejs/lib/ajax');
var Vector2 = require('pebblejs/lib/vector2');
var Feature = require('pebblejs/platform/feature');

// var stringify = require('json-stringify-safe'); // elements and some other things got circular dependencies which JSON.stringify doesnt like

var loadingScreen = new UI.Card({
    title: 'Loading...',
    body: 'Please hold for a moment while I fetch the ride data'
});

var errorScreen = new UI.Card({
    title: 'Error!',
    body: 'Something bad happened.. If this continues, please contact the developer.'
});

var parkSelectionMenu = new UI.Menu({
    status: {
        backgroundColor: 0x00AAFF,
        separator: Feature.round('none', 'dotted')
    },  
    highlightBackgroundColor: 0x00AAFF,
    highlightTextColor: 'black',
    sections: [
        {
            items: [
                {
                    title: 'Disneyland',
                    icon: 'PALACE_ICON'
                },
                {
                    title: 'California Adventure',
                    icon: 'CALIFORNIA_ICON'
                }
            ]
        }
    ]
});

var attractionList = new UI.Menu({
    backgroundColor: {
        color: 0x00AAFF,
        separator: Feature.round('none', 'dotted')
    },
    highlightBackgroundColor: 0x00AAFF,
    highlightTextColor: 'black',
    sections: [
        {
            items: []
        }
    ]
});

parkSelectionMenu.on('select', function(e) {
    var parkType;

    switch (e.itemIndex) {
        case 0:
            parkType = 'disneyland';
            break;
        case 1:
            parkType = 'californiaadventure';
            break;
    }

    loadingScreen.show();

    ajax({
        url: 'https://disney-wait.memester.xyz/rideTimes?park=' + parkType,
        type: 'json'
    }, function(data) {
        loadingScreen.hide();

        var attractions = [];

        for (var i = 0; i < data.length; i++) {
            var attraction = data[i];

            attractions.push({ 
                title: attraction.name, 
                subtitle: attraction.waitTime || 0 + ' minutes (' + attraction.status + ')'
            });
        }

        attractionList.items(0, attractions);
        
        attractionList.show();
    }, function(err) {
        console.error(err);
        loadingScreen.hide();
        errorScreen.show();
    });
});

parkSelectionMenu.show();