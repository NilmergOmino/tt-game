window.addEventListener('DOMContentLoaded', function(){
    var tDescription = document.getElementById('travel-description'),
        tDestination = document.getElementById('travel-destination'),
        tCurrentPosition = document.getElementById('travel-current-position'),
        tMovements = document.getElementById('travel-movements'),
        tCommandLine = document.getElementById('command-line'),
        tMap = document.getElementById('world-map'),
        countriesLength = countries.length,
        allPlaces = countries.concat(seas),
        allPlacesLength = allPlaces.length;
    var randomStartCountry, randomEndCountry, tStartPosition, tDestinationValue, tDescriptionValue, tMove, tCurrentPositionValue, tAllVisitedPlaces;
    tCommandLine.focus();

    var setMapView = function(mapCode){
        if(mapCode.length>0){
            var mapCode = mapCode.split("_"),
                scale = mapCode[2],
                xCoord = 200-(mapCode[0]*scale),
                yCoord = 125-((1000-mapCode[1])*scale),
                mapSizeX = 2000*scale,
                mapSizeY = 1000*scale;
            tMap.style.backgroundSize = mapSizeX+'px '+mapSizeY+'px';
            tMap.style.backgroundPosition = xCoord+'px '+yCoord+'px';
        }
    }

    var setRandomCountries = function(){
        randomStartCountry = Math.floor(Math.random()*countriesLength);
        do{
            randomEndCountry = Math.floor(Math.random()*countriesLength);
        }
        while(randomStartCountry == randomEndCountry);
    }

    var setGameStartValues = function(){
        setRandomCountries();
        tStartPosition = countries[randomStartCountry][0],
        tDestinationValue = countries[randomEndCountry][0],
        tDescriptionValue = "Witaj przyjacielu, musisz dostać się do pewnego państwa przekraczając jak najmniejszą ilość granic. Zaczynajmy!<br><br>Twoje obecne położenie: "+tStartPosition+"<br>Twój cel podróży: "+tDestinationValue,
        tMove = 0,
        tCurrentPositionValue = tStartPosition,
        tAllVisitedPlaces = tStartPosition+" -> ";
        tDestination.innerHTML = tDestinationValue;
        setGameValues(tMove, tCurrentPositionValue, tDescriptionValue);
        setMapView(countries[randomStartCountry][1]);
    }

    var setGameValues = function(tMove, tCurrentPositionValue, tDescriptionValue){
        tDescription.innerHTML = tDescriptionValue;
        tCurrentPosition.innerHTML = tCurrentPositionValue;
        tMovements.innerHTML = tMove;
    }

    var makeMove = function(placeToGo){
        var isOk = false,
            needHelp = false;
        if(placeToGo.toLowerCase() == "pomoc"){
            needHelp = true;
            var whereCanYouGo = '';
            for(var i=0; i<allPlacesLength; i++){
                if(allPlaces[i][0] == tCurrentPositionValue){
                    var thisPlaceLength = allPlaces[i].length;
                    for(var j=2; j<thisPlaceLength; j++){
                        whereCanYouGo += allPlaces[i][j]+", ";
                    }
                }
            }
        }
        else{
            for (var i = 0; i < allPlacesLength; i++) {
                if(allPlaces[i][0].toLowerCase() == placeToGo.toLowerCase()){
                    var thisPlaceLength = allPlaces[i].length;
                    for(var j=2; j<thisPlaceLength; j++){
                        if(allPlaces[i][j] == tCurrentPositionValue){
                            isOk = true;
                            placeToGo = allPlaces[i][0];
                            tAllVisitedPlaces += placeToGo+" -> ";
                            setMapView(allPlaces[i][1]);
                        }
                    }
                }
            }
        }
        if(isOk){
            tMove +=1;
            tCurrentPositionValue = placeToGo;
            if(tCurrentPositionValue == tDestinationValue){
                tDescriptionValue = "Wspaniale! Dotarłeś do celu!<br>Twoja trasa:<br><br>"+tAllVisitedPlaces.slice(0, -4)+"<br><br>aby rozpocząć nową grę wpisz polecenie: restart";
            }
            else{
                tDescriptionValue = 'Twoja nowa pozycja to: <span class="span_bold">'+tCurrentPositionValue+'</span>';
            }
            setGameValues(tMove, tCurrentPositionValue, tDescriptionValue);
        }
        else if(needHelp){
            tDescriptionValue = "Nie wiesz gdzie się udać? Oto Twoje możliwości:<br><br>"+whereCanYouGo.slice(0,-2);
            setGameValues(tMove, tCurrentPositionValue, tDescriptionValue);
        }
        else{
            tDescriptionValue = 'Nie ma miejsca <span class="span_bold">'+placeToGo+'</span> w okolicy';
            setGameValues(tMove, tCurrentPositionValue, tDescriptionValue);
        }
    }

    var validateString = function(string){
        return true;
    }

    setGameStartValues();

    tCommandLine.addEventListener('keydown', function(e){
        if(e.keyCode == "13"){
            if(validateString(tCommandLine.value)){
                if(tCommandLine.value.trim().toLowerCase() == 'restart'){
                    setGameStartValues();
                }
                else if(tCommandLine.value.trim().toLowerCase() == 'komendy'){
                    tDescriptionValue = 'W każdym momencie gry możesz użyć następujących komend:<br><span class="span_bold">pomoc</span> - wyświetla możliwe ruchy<br><span class="span_bold">restart</span> - restartuje gre losując nowe miejsca<br><span class="span_bold">komendy</span> - pokazuje możliwe komendy';
                    setGameValues(tMove, tCurrentPositionValue, tDescriptionValue);
                }
                else makeMove(tCommandLine.value.trim());
            }
            else{
                tDescription.innerHTML = "Nie ma takiego miejsca";
            }
            tCommandLine.value = '';
        }
    });
});
