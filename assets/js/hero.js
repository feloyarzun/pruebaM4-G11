$(document).ready(function(){
  $('#heroForm').submit(function(event){
    event.preventDefault();
    let heroId = Number($('#heroInput').val());
    //console.log(heroId);
    
    if (heroId < 1 || heroId > 731) {
      alert("Por favor, ingrese un número entre 1 y 731.");
      return;
    }
    const settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://superheroapi.com/api.php/d59f6df04aed61f2486c787636a91b96/" + heroId,
      "method": "GET",
      "dataType": "json",
      "headers": {
        "Accept": "*/*",
      }
    };

    $.ajax(settings).done(function (response) {
      //console.log(response);
      heroData(response);
      statsChart(response.powerstats, response.name);
    }).fail(function (error) {
      console.error("Error:", error);
      alert("Error al obtener los datos del superhéroe, intente nuevamente.");
    });
  });

  function heroData(hero) {
    const heroInfo = `
      <div class="card">
      <div class="card-header">
        <h2>SuperHero Encontrado</h2>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-4">
            <img src="${hero.image.url}" alt="${hero.name}" class="img-fluid">
          </div>
          <div class="col-md-8">
            <h3>Nombre: ${hero.name}</h3>
            <p>Conexiones: ${hero.connections['group-affiliation']}</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp; Publicado por: ${hero.biography.publisher}</p><hr>
            <p>Ocupación: ${hero.work.occupation}</p><hr>
            <p>Primera Aparición: ${hero.biography['first-appearance']}</p><hr>
            <p>Altura: ${hero.appearance.height.join(' - ')}</p><hr>
            <p>Peso: ${hero.appearance.weight.join(' - ')}</p><hr>
            <p>Alianzas: ${hero.biography.aliases.join(', ')}</p>
          </div>
        </div>
      </div>
    </div>
    `;
    $('#heroInfo').html(heroInfo); 
  }

  function statsChart(powerstats, name) {
    const dataPoints = [
      { y: powerstats.intelligence, name: "intelligence" },
      { y: powerstats.strength, name: "strength" },
      { y: powerstats.speed, name: "speed" },
      { y: powerstats.durability, name: "durability" },
      { y: powerstats.power, name: "power" },
      { y: powerstats.combat, name: "combat" }
    ];
  
    var chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      title: {
        text: `Estadisticas de poder para ${name}`
      },
      legend: {
        cursor: "pointer",
        itemclick: explodePie
      },
      data: [{
        type: "pie",
        showInLegend: true,
        toolTipContent: "{name}: <strong>{y}</strong>",
        indexLabel: "{name} - {y}",
        dataPoints: dataPoints
      }]
    });
    chart.render();
  }
  
  function explodePie(e) {
    if (typeof(e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
      e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
    } else {
      e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
    }
    e.chart.render();
  }
});
