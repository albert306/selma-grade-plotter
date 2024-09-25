function createBarChartElement(labels, values, myGrade) {
    if (labels.length !== values.length) {
        return
    }

    const maxValue = Math.max(...values)

    const table = document.createElement("table")
    table.id = "barChart"
    table.className = "barchart"
    const valueRow = document.createElement("tr")
    const labelRow = document.createElement("tr")

    for (var i = 0; i < values.length; i++) {
        const label = document.createElement("span")
        label.innerText = values[i]
        const bar = document.createElement("div")
        bar.className = "bar"
        bar.style.height = `${(values[i] / maxValue) * 100}%`
        
        const td = document.createElement("td")
        td.appendChild(label)
        td.appendChild(bar)
        valueRow.appendChild(td)
    }

    for (var i = 0; i < labels.length; i++) {
        const div = document.createElement("div")
        div.innerText = labels[i]
        if (labels[i] === myGrade) {
            div.style.backgroundColor = "red"
            div.style.color = "white"
        }
        const td = document.createElement("td")
        td.appendChild(div)
        labelRow.appendChild(td)
    }

    table.appendChild(valueRow)
    table.appendChild(labelRow)

    return table
}