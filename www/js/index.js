document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    // console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    // document.getElementById('deviceready').classList.add('ready');
}

window.onload = (event) => {
    console.log("Pàgina carregada completament. Inicialitzant..");
    var options = { "swipeable": true };
    var el = document.getElementsByClassName('tabs');
    var tabInstance = M.Tabs.init(el[0], options);

    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, {
      // specify options here
    });

    //ajax
    let limit = 10;
    let offset = Math.floor(Math.random() *(1302-limit));
    //primera llamada ajax para obtener lista de pokemons
    //cada item tiene dos llaves: "name" i "url"
    $.ajax({
      method: "GET",
      url: "https://pokeapi.co/api/v2/pokemon/?offset="+offset+"&limit="+limit,
      dataType: "json",   // necessitem això pq ens retorni un objecte JSON
    }).done(function (msg) {
      for(let item in msg.results) {
        console.log(msg.results[item]);
        //segunda llamada ajax obtiene informació de cada pokemon
        $.ajax({
          method: "GET",
          url: msg.results[item].url,
          dataType: "json",   // necessitem això pq ens retorni un objecte JSON
        }).done(function (msg2) {
          $('#pokemons').append("<li class=\"collection-item avatar\"><img src="+msg2.sprites.front_default+" alt=\"\" class=\"circle\">"+msg.results[item].name+"<a id=\""+msg.results[item].name+"\" href=\"#!\" class=\"secondary-content\"><i class=\"material-icons\">send</i></a></li>");
        })
      };
    }).fail(function () {
      alert("ERROR");
    });
  
    $("#pokemons").on("click", ".secondary-content", function () {
    
      console.log("click");
      tabInstance.select('test-swipe-2');
      console.log($(this).attr("id"));
      $.ajax({
        method: "GET",
        url: "https://pokeapi.co/api/v2/pokemon/"+$(this).attr("id"),
        dataType: "json",   // necessitem això pq ens retorni un objecte JSON
      }).done(function (msg) {
        console.log(msg);
        let types = "";
        for(let type in msg.types) {
          types += msg.types[type].type.name + " ";
        };
        let moves = "";
        for(let move in msg.moves) {
          moves += msg.moves[move].move.name + " ";
        };
        let stats = "";
        for(let stat in msg.stats) {
          stats += msg.stats[stat].stat.name + ": " + msg.stats[stat].base_stat + "<br>";
        };
        $("#test-swipe-2").html("<h4>"+msg.name+"</h4><img class =\"pokemon\" src="+msg.sprites.back_default+" alt=\"\"><img class =\"pokemon\" src="+msg.sprites.front_default+" alt=\"\"><p><b>Types:</b> "+types+"<br><br><b>Stats:</b> <br>"+stats+"<br><b>Moves:</b> "+moves+"</p>");
      });
    });
};