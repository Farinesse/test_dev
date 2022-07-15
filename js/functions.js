const makeHTMLElement = (name, cls, content) => {
  let element = document.createElement(name);
  element.className = cls;
  if (content != "" || content != undefined) {
    element.textContent = content;
  }
  return element;
};

const getDataFromAPI = (url) =>
  new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: "GET",
      success: function (res) {
        resolve(res.data);
      },
      error: function (err) {
        reject(err);
        console.log(err);
      },
    });
  });

const makeCards = (parent, info, index1, index2) => {
  /* let card, hdr, title;
    for (let i = 0; i < data.length; i++) { 
     card = makeHTMLElement("div", "mycard");
      hdr = makeHTMLElement("div", "hdr");
      title = makeHTMLElement("h3", "mycard-title", data[i].libelle_station);
      card.appendChild(hdr);
      card.appendChild(title); 
    //parent.appendChild(card);
    }*/
  makeOneCard(parent, info, index1, index2);
};

const makeOneCard = (parent, info, index1, index2) => {
  let card, hdr, title, p;
  card = makeHTMLElement("div", "card forCard");
  hdr = makeHTMLElement("div", "card-body");
  title = makeHTMLElement(
    "h4",
    "card-title",
    info[0] /* data[i].libelle_station */
  );
  p = makeHTMLElement("p", "card-text", info[1]);
  hdr.appendChild(title);
  hdr.appendChild(p);
  p = makeHTMLElement("p", "card-text", info[2]);
  hdr.appendChild(p);
  card.appendChild(hdr);
  showModal(card, index1, index2);
  //card.appendChild(title);
  parent.appendChild(card);
};

const chooseDat = () => {
  let date = document.querySelector('input[type="datetime-local"]');
  //let found = [];
  let st = [];
  let dataaa = dataStations;
  //foundStation = dataStations;
  dataStations.forEach((station) => {
    foundStation.push(station);
  });

  console.log(dataaa);
  date.addEventListener("change", (e) => {
    chooseDate = new Date(e.target.value);

    //let month = (chooseDate.getMonth() + 1).toString();
    //let day = chooseDate.getDate().toString();

    let year = chooseDate.getFullYear();
    var month = ("0" + (chooseDate.getMonth() + 1)).slice(-2);
    var day = ("0" + chooseDate.getDate()).slice(-2);

    const formatedDate = [year, month, day].join("-");

    for (let i = 0; i < dataStations.length; i++) {
      st = dataStations[i].filter((station) => {
        console.log(station.date_mesure_temp == formatedDate);
        return station.date_mesure_temp == formatedDate;
      });
      //if(st.length > 0) {
      foundStation.splice(i, 1, st);
      //}
      //foundStation.push(st);
    }

    console.log("filter ", foundStation);
    createAccordion(foundStation, "update");
  });
};

const images = [
  "../assets/images/3-Riviere_Odet.jpg",
  "../assets/images/587805.jpg",
  "../assets/images/estuaire-gironde.jpg",
  "../assets/images/belle.jpg",
  "../assets/images/rever-riviere-960x640.jpg",
  "../assets/images/riviere-restigouche-rivieres-quebec.jpg",
];

const carouselItems = (data) => {
    let temperature = [];
    data.forEach((item) => {
        const code_station = item.code_station;
        const url = `https://hubeau.eaufrance.fr/api/v1/temperature/chronique?code_station=${code_station}&sort=desc&pretty&page=1&size=100`;
      const stationPromise = getDataFromAPI(url);
      stationPromise
        .then((res) => { 
            temperature.push(res[0].resultat);
            //console.log("ergregergreg", temperature);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    setTimeout(() => {

   
    console.log("ergregergreg", temperature);;
  //let data = data.slice(0, 5);
  let dev1, img, div2, h5, p;
  let carousel = document.querySelector(".carousel-inner"); // $('.carousel-inner');
  carousel.style = "border-radius: 10px;";
  for (let i = 0; i < data.length; i++) {
    div1 = makeHTMLElement("div", "carousel-item");
    if (i === 0) {
      div1.classList.add("active");
    } 
    img = makeHTMLElement("img", "w-100");
    img.classList.add("img-carousel");
    img.src = images[i];
    div2 = makeHTMLElement("div", "carousel-caption d-none d-md-block");
    h5 = makeHTMLElement("h1", "", data[i].libelle_station);
    
    p = makeHTMLElement("p", "", `${temperature[i].toFixed(1)} °C`);
    p.style="font-size: 25px;"
    div2.appendChild(h5);
    div2.appendChild(p);
    
   
    div1.appendChild(img);
    div1.appendChild(div2);
    carousel.appendChild(div1);
  }
}, 500);
};

const showModal = (elem, index, index2) => {
  let modal, content, header, body, title, p, close;

  title = document.querySelector(".modal-title");

  body = document.querySelector(".modal-body"); // makeHTMLElement("div", "modal-body");
  modal = document.getElementById("myModal");
  //content = makeHTMLElement("div", "modal-detail");

  close = document.getElementsByClassName("close")[0];
  elem.addEventListener("click", (e) => {
    title.textContent = "";
    body.textContent = "";

    title.textContent = dataStations[index][index2].libelle_station;
    makeModalBody(body, p, index, index2);

    modal.style.display = "block";
    close.onclick = function () {
      modal.style.display = "none";
    };

    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  });
};
const showModalChart = (index) => {
  let modal, content, header, body, title, p, close, chart;
  title = document.querySelector(".modal-title");

  body = document.querySelector(".modal-body"); // makeHTMLElement("div", "modal-body");
  modal = document.getElementById("myModal");
  //content = document.querySelector(".modal-detail");

  chart = makeHTMLElement("canvas");
  chart.id = "myChart";
  //makeChart();
  preparChart(index);

  close = document.getElementsByClassName("close")[0];
  //elem.addEventListener("click", (e) => {
  title.textContent = "";
  body.textContent = "";

  body.appendChild(chart);

  modal.style.display = "block";
  close.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
  //});
};

const preparDataChart = (datastations) => {
  console.log("DATA CHART ", datastations);

  dataChart = [];
  if (datastations.length > 0) {
    let data;
    for (let i = 0; i < datastations.length; i++) {
      if (i === 1) {
        console.log(data[0]);
      }
      data = [];
      for (let j = 0; j < datastations[i].length; j++) {
        let time = {
          code_station: "",
          date: "",
          hour: "",
          result: "",
        };
        time.code_station = datastations[i][j].code_station;
        time.date = datastations[i][j].date_mesure_temp;
        time.hour = datastations[i][j].heure_mesure_temp;
        time.result = datastations[i][j].resultat;
        data.push(time);
      }
      dataChart.push(data);
    }
    //console.log(dataChart[0][0].hour, dataChart[0][1].hour);
    return dataChart;
  }
  return [];
};



const preparChart = (index1) => {
    console.log("index", index1);
  setTimeout(() => {
    let datac = preparDataChart(foundStation);
    console.log("dddd ", foundStation, " ssss ", datac);
    let tempertures = [];
    const labels = [];

    
    datac[index1].forEach((time) => {
      tempertures.push(time.result);
      labels.push(`${time.date} ${time.hour.substring(0, 5)}`);
    });

    console.log("temperature ", tempertures.length);

    //const labels = ["January", "February", "March", "April", "May", "June"];

    const data = {
      labels: labels,
      datasets: [
        {
          label: "My First dataset",
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgb(255, 99, 132)",
          data: tempertures, // [0, 10, 5, 2, 20, 30, 45],
        },
      ],
    };

    const config = {
      type: "line",
      data: data,
      options: {},
    };

    datac.forEach((e) => {});
    const myChart = new Chart(document.getElementById("myChart"), config);
  });
};

const makeModalBody = (body, p, index, index2) => {
  p = makeHTMLElement(
    "p",
    "",
    `Commune : \u00A0\u00A0\u00A0 ${dataStations[index][index2].libelle_station}`
  );
  //content.appendChild(p);
  body.appendChild(p);

  p = makeHTMLElement(
    "p",
    "",
    `Station : \u00A0\u00A0\u00A0 ${dataStations[index][index2].libelle_station}`
  );
  body.appendChild(p);

  p = makeHTMLElement(
    "p",
    "",
    `Qualification : \u00A0\u00A0\u00A0 ${dataStations[index][index2].libelle_qualification}`
  );
  body.appendChild(p);

  p = makeHTMLElement(
    "p",
    "",
    `Parametre : \u00A0\u00A0\u00A0 ${dataStations[index][index2].libelle_parametre}`
  );
  body.appendChild(p);

  p = makeHTMLElement(
    "p",
    "",
    `Code Commune : \u00A0\u00A0\u00A0 ${dataStations[index][index2].code_commune}`
  );
  body.appendChild(p);

  p = makeHTMLElement(
    "p",
    "",
    `Code Station : \u00A0\u00A0\u00A0 ${dataStations[index][index2].code_station}`
  );
  body.appendChild(p);

  p = makeHTMLElement(
    "p",
    "",
    `Code qualification : \u00A0\u00A0\u00A0 ${dataStations[index][index2].code_qualification}`
  );
  body.appendChild(p);

  p = makeHTMLElement(
    "p",
    "",
    `Code Parametre : \u00A0\u00A0\u00A0 ${dataStations[index][index2].code_parametre}`
  );
  body.appendChild(p);

  p = makeHTMLElement(
    "p",
    "",
    `Code Unite : \u00A0\u00A0\u00A0 ${dataStations[index][index2].code_unite}`
  );
  body.appendChild(p);

  p = makeHTMLElement(
    "p",
    "",
    `Symbole Unite : \u00A0\u00A0\u00A0 ${dataStations[index][index2].symbole_unite}`
  );
  body.appendChild(p);

  p = makeHTMLElement(
    "p",
    "",
    `Température : \u00A0\u00A0\u00A0 ${dataStations[index][
      index2
    ].resultat.toFixed(2)}`
  );
  body.appendChild(p);

  p = makeHTMLElement(
    "p",
    "",
    `Date Mesure : \u00A0\u00A0\u00A0 ${dataStations[index][index2].date_mesure_temp}
     `
  );
  body.appendChild(p);

  p = makeHTMLElement(
    "p",
    "",
    `Heur Mesure : \u00A0\u00A0\u00A0 ${dataStations[index][index2].heure_mesure_temp}`
  );
  body.appendChild(p);

  p = makeHTMLElement(
    "p",
    "",
    `Coordonnées : \u00A0\u00A0\u00A0 latitude : \u00A0\u00A0\u00A0 ${dataStations[index][index2].latitude}
    ,\u00A0\u00A0\u00A0longitude : \u00A0\u00A0\u00A0 ${dataStations[index][index2].longitude}`
  );
  body.appendChild(p);
};
