window.onload = init

function init() {
    const storageInfo = JSON.parse(localStorage.getItem('user-info'))


    document.getElementById("submitButton").addEventListener("click", function (event) {
        event.preventDefault()

        const name = document.getElementById('fullname')
        const email = document.getElementById('email')
        const departureTime = document.getElementById('form-departure-time')
        const arrivalTime = document.getElementById('form-arrival-time')
        const distance = document.getElementById('distance')
        const meteo = document.getElementById('meteo')

        const data = {
            name: name.value,
            email: email.value,
            departureTime: new Date(departureTime.value),
            arrivalTime: new Date(arrivalTime.value),
            distance: distance.value,
            meteo: meteo.value
        }

        if (name.value.length < 2 || name.value.length > 20) {
            alert('Le nom doit etre plus grand que 2 lettres et moins que 20 lettres')
            return
        }
        const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if (!email.value.match(validRegex)) {
            alert('Invalid email address!');
            return
        }

        if (distance.value < 0 || !distance.value.length) {
            alert('Invalid distance value')
            return
        }

        if (!storageInfo) {
            localStorage.setItem("user-info", JSON.stringify([data]))
        } else {
            localStorage.setItem("user-info", JSON.stringify([...storageInfo, data]))
        }

        location.reload()
    })

    const displayUserInfo = (storage = []) => {
        const actualizedStorage = JSON.parse(localStorage.getItem('user-info'))
        const table = document.getElementById('table')
        const tableSum = document.getElementById('totalSum').firstChild
        const sum = actualizedStorage?.length ?
            actualizedStorage?.reduce((accumulator, a) => parseInt(accumulator) + parseInt(a.distance), 0) : 0

        tableSum.innerHTML = `${sum} km`

        if (storage?.length) {
            storage.forEach((data, index) => {
                const newIndex = storage?.length === 1 ? actualizedStorage?.length - 1 : index
                const row = table.insertRow(newIndex + 1)
                const numberCell = row.insertCell(0)
                const nameCell = row.insertCell(1)
                const arrivalTimeCell = row.insertCell(2)
                const departureTimeCell = row.insertCell(3)
                const meteoCell = row.insertCell(4)
                const distanceCell = row.insertCell(5)

                const formattedDepartureDate = `${new Date(data.departureTime).toLocaleDateString('fr-FR')} ${new Date(data.departureTime).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                })}`
                const formattedArrivalDate = `${new Date(data.arrivalTime).toLocaleDateString('fr-FR')} ${new Date(data.arrivalTime).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                })}`

                numberCell.appendChild(document.createTextNode(`${newIndex + 1}`))
                nameCell.appendChild(document.createTextNode(data.name))
                arrivalTimeCell.appendChild(document.createTextNode(formattedDepartureDate))
                departureTimeCell.appendChild(document.createTextNode(formattedArrivalDate))
                meteoCell.appendChild(document.createTextNode(data.meteo))
                distanceCell.appendChild(document.createTextNode(`${data.distance} km`))
            })
        } else {
            const row = table.insertRow(1)
            const cell = row.insertCell(0)
            cell.colSpan = 6
            cell.appendChild(document.createTextNode('No data'))
        }
    }

    const displayChart = (storage) => {
        if (storage?.length) {
            var data = {
                labels: storage.map(data => `${new Date(data.departureTime).toLocaleDateString('fr-FR')} ${new Date(data.departureTime).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                })}`),
                datasets: [{
                    label: "Distance, km",
                    backgroundColor: "rgba(35, 112, 251, 0.2)",
                    borderColor: "rgb(35, 112, 251)",
                    borderWidth: 2,
                    hoverBackgroundColor: "rgba(35, 112, 251, 0.4)",
                    hoverBorderColor: "rgb(35, 112, 251)",
                    data: storage.map(data => data.distance),
                }]
            };

            var options = {
                maintainAspectRatio: false,
                scales: {
                    y: {
                        stacked: true,
                        grid: {
                            display: true,
                            color: "rgba(255,99,132,0.2)"
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            };

            new Chart('chart', {
                type: 'bar',
                options: options,
                data: data
            });
        } else {
            document.getElementById('chart').style.display = 'none'
            document.getElementById('chartContainer').appendChild(document.createTextNode('No data'))
        }
    }

    displayUserInfo(storageInfo)
    displayChart(storageInfo)

}
function distance(lon1, lat1, lon2, lat2) {
    var R = 6371; // Radius of the earth in km
    var dLat = (lat2-lat1).toRad();  // Javascript functions in radians
    var dLon = (lon2-lon1).toRad(); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  /** Converts numeric degrees to radians */
  if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
      return this * Math.PI / 180;
    }
  }
  
  window.navigator.geolocation.getCurrentPosition(function(pos) {
    console.log(pos); 
    console.log(
      distance(pos.coords.longitude, pos.coords.latitude, 42.37, 71.03)
    ); 
  });


