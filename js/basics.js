mapbox_token = "<< Add Your API Key >>";
weatherkey = "<< Add Your API Key >>";

var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};


function showPosition(position) {
    ele = document.getElementById("basics1");
    ele.style.display = "block";
    ele.innerHTML = `<strong>Your current position is :</strong>
        <br>Latitude -> ${position.coords.latitude} 
        <br>Longitude -> ${position.coords.longitude}
        <br>Accuracy -> ${position.coords.accuracy}
        <br>Timestamp -> ${position.timestamp}`;

    console.log(position);
}

function showError(error) {
    window.alert(`Error : ${error.message} (${error.code})`)
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError, options);
    } else {
        window.alert("Geolocation is not supported by this browser.");
    }
}

function fillForm() {
    ele_street = document.getElementById("street");
    ele_city = document.getElementById("city");
    ele_state = document.getElementById("state");
    ele_country = document.getElementById("country");
    ele_addr = document.getElementById("addr");

    let lat = 0
    let long = 0
    let resp;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function(position) {
            console.log(position.coords.latitude, position.coords.longitude)
            lat = await position.coords.latitude
            long = await position.coords.longitude

            let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${long}, ${lat}.json?access_token=${mapbox_token}`

            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", url, false);
            xhttp.send();

            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json' //,
                },
                beforeSend: function() {

                },
                error: function(xhr, textStatus, errorThrown) {
                    alert('An error occurred!');
                },
                success: function(response) {
                    if (response) {
                        features = response['features'];

                        features.forEach(f => {
                            type = f['place_type'][0];
                            if (type === 'locality') { street = f['text']; } else if (type === 'place') { city = f['text']; } else if (type === 'region') { state = f['text']; } else if (type === 'country') { country = f['text']; } else if (type === 'poi') { addr = f['place_name']; }
                        });

                        ele_street.value = street;
                        ele_city.value = city;
                        ele_state.value = state;
                        ele_country.value = country;
                        ele_addr.value = addr;
                    } else {
                        alert('An error occurred!');

                    }

                }
            });

        })
    }
}

function getDetails() {
    let lat = 0
    let long = 0
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function(position) {
            console.log(position.coords.latitude, position.coords.longitude)
            lat = await position.coords.latitude
            long = await position.coords.longitude

            let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${long}, ${lat}.json?access_token=${mapbox_token}`

            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", url, false);
            xhttp.send();
            console.log(xhttp.responseText);
        })
    }
}

function getCovidData() {

    ele2 = document.getElementById("basics2");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function(position) {
            console.log(position.coords.latitude, position.coords.longitude)
            lat = await position.coords.latitude
            long = await position.coords.longitude

            let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${long}, ${lat}.json?access_token=${mapbox_token}`

            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", url, false);
            xhttp.send();

            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json' //,
                },
                beforeSend: function() {

                },
                error: function(xhr, textStatus, errorThrown) {
                    alert('An error occurred!');
                },
                success: function(response) {
                    if (response) {
                        features = response['features'];

                        features.forEach(f => {
                            type = f['place_type'][0];
                            if (type === 'locality') { street = f['text']; } else if (type === 'place') { city = f['text']; } else if (type === 'region') { state = f['text']; } else if (type === 'country') {
                                countrycode = f['properties']['short_code'];
                                country = f['text'];
                            } else if (type === 'poi') { addr = f['place_name']; }
                        });

                        const settings = {
                            "async": true,
                            "crossDomain": true,
                            "url": `https://covid-19-data.p.rapidapi.com/country/code?code=${countrycode}`,
                            "method": "GET",
                            "headers": {
                                "x-rapidapi-key": "93d6478421mshcff35c0e1ff6140p1061cbjsnce6120e66263",
                                "x-rapidapi-host": "covid-19-data.p.rapidapi.com"
                            }
                        };

                        $.ajax(settings).done(function(response) {
                            console.log(response);

                            dt = response[0]['lastChange'];
                            var date = new Date(dt);
                            str_date = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();

                            cases = response[0];
                            confirmed = cases["confirmed"];
                            recovered = cases["recovered"];
                            deaths = cases["deaths"];
                            critical = cases["critical"];

                            ele2.style.display = "block";
                            ele2.innerHTML = `
                            <strong>Country</strong> -> ${country} 
                            <br><strong>Date</strong> -> ${str_date}
                            <br><strong>Confirmed Cases</strong> -> ${confirmed}
                            <br><strong>Recoverd</strong> -> ${recovered}
                            <br><strong>Deaths</strong> -> ${deaths}
                            <br><strong>Critical Cases</strong> -> ${critical}
                            `;
                        });
                    } else {
                        console.log('no');
                    }

                }
            });

        })
    }


}

function getWeatherUpdates() {

    ele3 = document.getElementById("basics3");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function(position) {
            console.log(position.coords.latitude, position.coords.longitude)
            lat = await position.coords.latitude
            long = await position.coords.longitude

            let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${weatherkey}`
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                beforeSend: function() {

                },
                error: function(xhr, textStatus, errorThrown) {
                    alert('An error occurred!');
                },
                success: function(response) {
                    if (response) {
                        console.log(response);
                        c_name = response['name'];

                        weather = response['weather'][0];
                        w_desc = weather['description'];

                        main = response['main'];
                        temp = (main['temp'] - 273.15).toPrecision(2);
                        feels_like = (main['feels_like'] - 273.15).toPrecision(2);
                        humidity = main['humidity'];
                        pressure = main['pressure'];


                        wind = response['wind'];
                        speed = wind['speed'];
                        deg = wind['deg'];

                        ele3.style.display = "block";
                        ele3.innerHTML = `
                            <strong>Place</strong> -> ${c_name}
                            <br><strong>Status</strong> -> ${w_desc}
                            <br><strong>Temperature</strong> -> ${temp}&#730;C
                            <br><strong>Feels Like</strong> -> ${feels_like}&#730;C
                            <br><strong>Humidity</strong> -> ${humidity}
                            <br><strong>Pressure</strong> -> ${pressure}
                            <br><strong>Wind Speed</strong> -> ${speed}
                            <br><strong>Degree</strong> -> ${deg}
                            `;



                    } else {
                        console.log('no');
                    }

                }
            });

        })
    }


}

document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        goDown();
    });
});

document.querySelectorAll('.scroll-up').forEach(btn => {
    btn.addEventListener('click', function() {
        goUp();
    });
});

function goUp() {
    let scrollDistance = document.documentElement.clientHeight;
    window.scrollBy(0, scrollDistance * -1);
}

function goDown() {
    let scrollDistance = document.documentElement.clientHeight;
    window.scrollBy(0, scrollDistance);
}