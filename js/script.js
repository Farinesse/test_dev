let dataStations = [];
let foundStation = [];
let chooseDate;
$(document).ready(function () {
  const url =
    "https://hubeau.eaufrance.fr/api/v1/temperature/station?code_departement=33&pretty";
  let myPromise =
  
    getDataFromAPI(url);

  myPromise.then(
    function (value) {
      carouselItems(value);
      for (let i = 0; i < value.length; i++) {
        getStations(value[i].code_station, value[i].libelle_station);
      }
      console.log(value);

      setTimeout(() => {
        createAccordion(dataStations);
        chooseDat();
        document.getElementById('resett').addEventListener('click', () => {
          createAccordion(dataStations, 'update');
        })
      }, 1000);
    },
    function (error) {}
  );
});

var cards = document.getElementById("cards");

const getStations = (code_station, libelle_station) => {
  let stations = [];

  const url = `https://hubeau.eaufrance.fr/api/v1/temperature/chronique?code_station=${code_station}&sort=desc&pretty&page=1&size=100`;
  const stationPromise = getDataFromAPI(url);
  stationPromise
    .then((res) => {
      for (var i = 0; i < res.length; i++) {
        stations.push(res[i]);
      }
      dataStations.push(stations);
    })
    .catch((err) => {
      console.log(err);
    });
};

const createAccordion = (data, update) => {
  //console.log("accordion", data);
  let accordion, panel, mychart, btn;
  if (update == "update") {
    cards.innerHTML = "";
  }
  for (let i = 0; i < data.length; i++) {
    if (data[i].length > 0) {
      accordion = makeHTMLElement(
        "div",
        "accordion",
        data[i][0].libelle_station
      );

      btn = makeHTMLElement("button", "btn btn-info", "graph");
      mychart = makeHTMLElement("div", "graph");
      mychart.style = "z-index: 10;";

      btn.addEventListener("click", (e) => {
        console.log("graph ", foundStation);

        showModalChart(i);
        e.stopPropagation();
      });
      mychart.appendChild(btn);

      accordion.appendChild(mychart);
      panel = makeHTMLElement("div", "panel forPanel");
      //panel.textContent = "";
      panel.style = "overflow-y: scroll";
      for (let j = 0; j < data[i].length; j++) {
        makeCards(
          panel,
          [
            `Date mesure ${data[i][j].date_mesure_temp}`,
            `Heur mesure ${data[i][j].heure_mesure_temp}`,
            `Temperature: ${data[i][j].resultat.toFixed(2)} ${
              data[i][j].symbole_unite
            }`,
          ],
          i,
          j
        );
        cards.appendChild(accordion);
        cards.appendChild(panel);
      }
    }
  }

  var acc = document.getElementsByClassName("accordion");
  var i;

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  }
};
