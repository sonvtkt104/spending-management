const colorElement = document.querySelector('#color')
const listCollectionElement = document.querySelector('.list-collection')
const dateElement = document.querySelector(".date")
const collectionElement = document.querySelector("#collection")

const myChartMonthElement = document.getElementById('myChartMonth');
const myChartMonthCollectionElement = document.getElementById('myChartMonthCollection');

var myChartMonth
var myChartMonthCollection

const colors = {
  red : "#FF3333cc",
  blue: "#1890ffcc",
  yellow: "#FFAA33cc",
  orange: "#FF725Ecc",
  green: "#00CC66cc",
  pink: 'pink',
  gray: 'gray',
  brown : '#a52a2ab3',
  purple : '#800080b3',
}

var date;

var collections = [];   // {name, color}[]
if(localStorage.getItem("collections")) {
  collections = JSON.parse(localStorage.getItem("collections"));
} 

var items = [];  // {name, amount, collection}[]

var key = `${new Date().getMonth() + 1}-${new Date().getFullYear()}`

window.onload = function() {

  // setup color collection
  setUpColor()

  // setup collection
  setUpCollection()

  // setup list collection
  renderListCollection()

  // setup date
  date = formattedDate(new Date())
  dateElement.value = date
  const dateCurrent = formattedDate(new Date())

  // render analysis title
  renderAnalysisTitles()

  // render list items
  console.log('key: ' + key)
  if(localStorage.getItem(key)) {
    let itemsMonth = JSON.parse(localStorage.getItem(key))
    if(itemsMonth[date]) {
      items = itemsMonth[date]
    } else {
      items = []
    }
  } else {
    items = []
  }
  renderListItems()

  // render total amount in day 
  renderTotalAmountInDay()

  // render analysis month
  renderAnalysisMonth()

  // render analysis month collection
  renderAnalysisMonthCollection()

  // handle change date
  dateElement.addEventListener("change", function(e) {
    let dateChoose = e.target.value
    date = dateChoose

    let keyChange = `${new Date(dateChoose).getMonth() + 1}-${new Date(dateChoose).getFullYear()}`
    if(localStorage.getItem(keyChange)) {
      let itemsMonth = JSON.parse(localStorage.getItem(keyChange))
      if(itemsMonth[date]) {
        items = itemsMonth[date]
      } else {
        items = []
      }
    } else {
      items = []
    }
    
    if(dateChoose == dateCurrent) {
      document.querySelector(".date-name").innerHTML = "To day"
    } else {
      let parts = dateChoose.split("-");
      document.querySelector(".date-name").innerHTML = parts[2] + "-" + parts[1] + "-" + parts[0];
    }

    reRender()
    renderAnalysisTitles()
  })

   // handle Add Collection
  document.querySelector(".add-collection button").addEventListener("click", function(e) {
    let nameCollectionAdd = document.querySelector(".add-collection input").value 
    let colorCollectionAdd = document.querySelector(".add-collection select").value
  
    if(nameCollectionAdd && colorCollectionAdd) {
      let obj = {
        name: nameCollectionAdd,
        color: colorCollectionAdd
      }
      collections.push(obj)
      localStorage.setItem('collections', JSON.stringify(collections))

      // render again list collection
      renderListCollection()

      // setup collection element
      setUpCollection()

      document.querySelector(".add-collection input").value = ""
    }
  })


  // handle add items
  document.querySelector(".add-item button").addEventListener('click', () => {
    console.log('add items')
    let name = document.querySelector('#name').value;
    let amount = document.querySelector("#amount").value
    let collection = document.querySelector("#collection").value

    console.log(name, amount, collection)
    if(name && amount && collection) {
      let dateAdd = new Date(date)
      let keyAdd = `${dateAdd.getMonth() + 1}-${dateAdd.getFullYear()}`
      let obj = {
        name: name,
        amount: amount,
        collection: collection
      }

      items.push(obj)

      if(localStorage.getItem(keyAdd)) {
        let itemsMonth = JSON.parse(localStorage.getItem(keyAdd))
        itemsMonth[date] = items
        localStorage.setItem(keyAdd, JSON.stringify(itemsMonth))
      } else {
        let objAdd = {
          [date] : items
        }
        localStorage.setItem(keyAdd, JSON.stringify(objAdd))
      }

      reRender()

      document.querySelector('#name').value = ''
      document.querySelector("#amount").value = ''
    }
  })

  // open tab add collection
  document.querySelector('.open-add-collection').addEventListener('click', () => {
    document.querySelector(".collection-group").style.display = "block"
    document.querySelector('.back').style.display = "block"
    document.querySelector('.date-picker').style.display = "none"
    document.querySelector('.spending').style.display = "none"
    document.querySelector('#analysis').style.display = "none"
  })

  // open tab add analysis
  document.querySelector('.open-analysis').addEventListener('click', () => {
    document.querySelector(".collection-group").style.display = "none"
    document.querySelector('.back').style.display = "block"
    document.querySelector('.analysis-title').style.display = "block"
    document.querySelector('.date-picker-title').style.display = "none"
    document.querySelector('.date-picker').style.display = "flex"
    document.querySelector('.spending').style.display = "none"
    document.querySelector('#analysis').style.display = "block"
  })

  // handle click 'Back'
  document.querySelector('.back').addEventListener('click', () => {
    document.querySelector(".collection-group").style.display = "none"
    document.querySelector('.back').style.display = "none"
    document.querySelector('.date-picker').style.display = "flex"
    document.querySelector('.spending').style.display = "block"
    document.querySelector('#analysis').style.display = "none"
    document.querySelector('.analysis-title').style.display = "none"
    document.querySelector('.date-picker-title').style.display = "block"
  })

  console.log('hi')
}

const setUpColor = () => {
  for(let color in colors) {
    let option = document.createElement('option')
    option.value = color
    option.innerHTML = color
    colorElement.appendChild(option)
  }
}

const setUpCollection = () => {
  let a = collections.map((col) => {
    return `
      <option value="${col.name}">${col.name}</option>
    `
  }).join('\n')
  collectionElement.innerHTML = a
}

const renderListCollection = () => {
  let a = collections.map((collection) => {
    return `
      <span class="item-detail-collection" style="background: ${colors[collection.color]}; margin-bottom: 15px">
        ${collection.name}
      </span>
    `
  }).join('\n')

  listCollectionElement.innerHTML = a
}

function formattedDate(date) {
  // Get the year, month, and day from the date object
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed, so add 1 and pad with leading zeros if necessary
  const day = String(date.getDate()).padStart(2, '0'); // Pad day with leading zeros if necessary

  // Concatenate the year, month, and day with hyphens to form the formatted date string
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate
}

const renderListItems = () => {
  // get color by collection
  let objColorByCollection = {}
  collections.forEach(collection => {
    objColorByCollection[collection.name] = collection.color
  })

  if(items.length > 0) {
    let a = items.map(item => {
      return `
      <div class="flex item-detail" style="justify-content: space-between;">
        <div>
          <span class="item-detail-collection" style="background: ${colors[objColorByCollection[item.collection]]}">
            ${item.collection}
          </span>
          <span>${item.name}</span>
        </div>
        <span>${Number(item.amount).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
      </div>
      `
    }).join("\n");
    document.querySelector('.list-items').innerHTML = a
  } else {
    document.querySelector('.list-items').innerHTML = 'Hôm nay, bạn chưa thêm chi tiêu nào !'
  }
}

const renderTotalAmountInDay = () => {
  let sum = 0
  items.forEach(item => {
    sum = sum + Number(item.amount)
  })

  document.querySelector(".total-amount-in-day").innerHTML = sum.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

const renderAnalysisMonth = () => {

  let m = new Date(date).getMonth() + 1;
  let y = new Date(date).getFullYear()

  let labels = []
  let data = []
  if([1, 3, 5, 7, 8, 10, 12].includes(m)) {
    labels = Array.from({ length: 31 }, (_, index) => index + 1);
    data = Array(31).fill(0)
  } else if (m == 2 && (y % 4 != 0)) {
    labels = Array.from({ length: 28 }, (_, index) => index + 1);
    data = Array(28).fill(0)
  } else if (m == 2 && (y % 4 == 0)) {
    labels = Array.from({ length: 29 }, (_, index) => index + 1);
    data = Array(29).fill(0)
  } else {
    labels = Array.from({ length: 30 }, (_, index) => index + 1);
    data = Array(30).fill(0)
  }

  let key = `${m}-${y}`
  console.log('analysis key', key)
  if(localStorage.getItem(key)) {
    let dataMonth = JSON.parse(localStorage.getItem(key))

    for(let dateDay in dataMonth) {
      
      let day = new Date(dateDay).getDate() - 1

      let total = dataMonth[dateDay].reduce((pre, cur, index) => {
        let sum = Number(pre.amount) + Number(cur.amount)
        return {
          amount: sum
        }
      }, {amount : 0})
      
      console.log(dateDay, total.amount)

      data[day] = total.amount
    }
  }

  console.log('data analysis : ', data)
  // render total amount in month
  let totalMonth = data.reduce((pre, cur, index) => {
    return pre + cur
  }, 0)
  document.querySelector('.total-amount-in-month').innerHTML = totalMonth.toLocaleString("vi-VN", { style: "currency", currency: "VND" });


  myChartMonth = new Chart(myChartMonthElement, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'VNĐ',
        data: data,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

const renderAnalysisMonthCollection = () => {

  // get color by collection
  let objColorByCollection = {}
  collections.forEach(collection => {
    objColorByCollection[collection.name] = collection.color
  })
  console.log('objColorByCollection', objColorByCollection)

  let collectionNames = [];
  let collectionValues = [];
  let barColors = [];

  let m = new Date(date).getMonth() + 1;
  let y = new Date(date).getFullYear()

  let key = `${m}-${y}`
  console.log('analysis collection key', key)

  // get collection and value
  let arrItem = []   // {name, amount, collection}[]
  let objItem = {}   // {collection_name: amount}
  if(localStorage.getItem(key)) {
    let dataMonth = JSON.parse(localStorage.getItem(key))

    for(let dateDay in dataMonth) {
      arrItem = arrItem.concat(dataMonth[dateDay])
    }
  }
  arrItem.forEach(item => {
    if(objItem[item.collection]) {
      objItem[item.collection] = objItem[item.collection] + Number(item.amount)
    } else {
      objItem[item.collection] = Number(item.amount)
    }
  })
  console.log(arrItem, objItem)

  // sort objItem
  let arrSort = Object.entries(objItem);
  arrSort.sort((a, b) => b[1] - a[1]);
  objItem = Object.fromEntries(arrSort);
  console.log(objItem)

  // replace
  collectionNames = Object.keys(objItem)
  collectionValues = Object.values(objItem)

  collectionNames.forEach(collectionName => {
    barColors.push(colors[objColorByCollection[collectionName]])
  })


  console.log('chart month collection', collectionNames, collectionValues, barColors )

  // render labels
  let analysis_label = collectionNames.map((collectionName, index) => (
      `
        <div class="flex" style="margin-bottom: 15px">
          <span class="item-detail-collection" style="background: ${barColors[index]};">
            ${collectionName}
          </span>
          <span class="flex-col-center">
            ${collectionValues[index].toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
          </span>
        </div>
      `
  )).join('\n')
  document.querySelector(".analysis-label").innerHTML = analysis_label

  // render chart
  myChartMonthCollection = new Chart(myChartMonthCollectionElement, {
    type: "pie",
    data: {
      labels: collectionNames,
      datasets: [{
        backgroundColor: barColors,
        data: collectionValues
      }]
    },
  });
}

const reRender = () => {
  renderListItems()
  renderTotalAmountInDay()

  if(myChartMonth) {
    myChartMonth.destroy();
  }

  if(myChartMonthCollection) {
    myChartMonthCollection.destroy()
  }
 
  renderAnalysisMonth()
  renderAnalysisMonthCollection()
}

const renderAnalysisTitles = () => {
  let month_date = new Date(date).getMonth() + 1
  let year_date = new Date(date).getFullYear()
  document.querySelector('.analysis-title').innerHTML = `Phân tích chi tiêu tháng ${month_date}/${year_date}`
}
