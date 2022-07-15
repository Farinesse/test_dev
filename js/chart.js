
  setTimeout(() => {
    let datac = preparDataChart(dataStations);
    let tempertures = [];
    const labels = [];
    datac[0].forEach((time) => {
      tempertures.push(time.result);
      labels.push(`${time.date} ${time.hour.substring(0, 5)}`);
    });

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
