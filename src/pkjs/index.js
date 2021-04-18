require('pebblejs'); // Must require this or build error moment
var UI = require('pebblejs/ui');
var ajax = require('pebblejs/lib/ajax');
var Feature = require('pebblejs/platform/feature');

var API_BASE = 'https://disney-wait.memester.xyz';
// var API_BASE = 'http://localhost:3045'

var attractionsData; // store for reference from attractionsMenu select event

function boolReadable(boolVal) {
    return boolVal ? 'Yes' : 'No'
}

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

var attractionsMenu = new UI.Menu({
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
        url: API_BASE + '/rideTimes?park=' + e.item.title, //e.item.title.toLowerCase().split(' ').join(''), // as per our api, all park types will be lowercase with no spaces.. Maybe I should just not do this because its inconsistent.. doesnt matter, too lazy to deploy another API change..
        type: 'json'
    }, function(data) {
        loadingScreen.hide();
        
        attractionsData = data;

        var attractions = [];
        
        for (var i = 0; i < data.length; i++) {
            var attraction = data[i];
            
            attractions.push({ 
                title: attraction.name, 
                subtitle: attraction.waitTime || 0 + ' minutes (' + attraction.status + ')'
            });
        }

        attractionsMenu.section(0, {
            title: e.item.title,
            items: attractions
        });
        attractionsMenu.show();
    }, function(err) {
        console.log(err);
        loadingScreen.hide();
        errorScreen.show();
    });
});

attractionsMenu.on('select', function(e) {
    for (var i = 0; i < attractionsData.length; i++) {
        var attraction = attractionsData[i];

        if (attraction.name === e.item.title) {
            var attractionCard = new UI.Card({
                title: 'Info',
                titleColor: Feature.color(0x00AAFF, 'black'),
                body: 'Wait Time: ' + (attraction.waitTime || 0) + ' min' 
                    + '\nFast Pass: ' + boolReadable(attraction.fastPass) 
                    + '\nSingle Rider: ' + boolReadable(attraction.singleRider) 
                    + '\nLast Updated: ' + new Date(attraction.lastUpdate).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, day: 'numeric', month: 'numeric' }),
                bodyColor: 0x555555,
                scrollable: true
            });

            attractionCard.show();
        }
    }
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