require('pebblejs'); // Must require this or build error moment
var UI = require('pebblejs/ui');
var ajax = require('pebblejs/lib/ajax');
var Feature = require('pebblejs/platform/feature');

var API_BASE = 'https://disney-wait.memester.xyz';

var loadingScreen = new UI.Card({
    status: {
        backgroundColor: Feature.color(0x00AAFF, 'white'),
        separator: 'none'
    },
    title: 'Loading...',
});

var errorScreen = new UI.Card({
    status: {
        backgroundColor: Feature.color(0x00AAFF, 'white'),
        separator: 'none'
    },
    title: 'Error!',
    body: 'Something bad happened.. If this continues, please contact the developer.',
});

var attractionList = new UI.Menu({
    status: {
        backgroundColor: Feature.color(0x00AAFF, 'white'),
        separator: 'none'
    },
    highlightBackgroundColor: Feature.color(0x00AAFF, 'black'),
    highlightTextColor: Feature.color('black', 'white'),
    sections: [{ items: [] }]
});

var parkSelectionMenu = new UI.Menu({
    status: {
        backgroundColor: Feature.color(0x00AAFF, 'white'),
        separator: 'none'
    },  
    highlightBackgroundColor: Feature.color(0x00AAFF, 'black'),
    highlightTextColor: Feature.color('black', 'white'),
    sections: [{ items: [] }]
});

parkSelectionMenu.on('select', function(e) {
    loadingScreen.show();

    ajax({
        url: API_BASE + '/rideTimes?park=' + e.item.title.toLowerCase().split(' ').join(''), // as per our api, all park types will be lowercase with no spaces.. Maybe I should just not do this because its inconsistent.. doesnt matter, too lazy to deploy another API change..
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
        console.log(err);
        loadingScreen.hide();
        errorScreen.show();
    });
});


loadingScreen.show();

ajax({
    url: API_BASE + '/parks',
    type: 'json'
}, function(data) {
    var parks = [];

    for (var i = 0; i < data.length; i++) {
        var park = data[i];

        parks.push({
            title: park.name,
            subtitle: park.closed ? 'Closed' : park.opening + ' - ' + park.closing
        });
    }

    loadingScreen.hide();
    parkSelectionMenu.items(0, parks);
    parkSelectionMenu.show();
}, function(err) {
    console.log(err);
    loadingScreen.hide();
    errorScreen.show();
});