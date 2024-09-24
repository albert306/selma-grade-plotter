function insertPlotButtons() {
    document.getElementsByClassName("tbsubhead")[0].insertAdjacentHTML("beforeend", "<th></th>")

    const examResultRows = document.getElementsByClassName("tbdata")

    for (let i = 0; i < examResultRows.length; i++) {
        const row = examResultRows[i];

        const gradesButton = row.getElementsByClassName("link")[0]
        if (gradesButton == null) {
            continue
        }

        const plotButton = document.createElement("a")
        plotButton.href = "#"
        plotButton.id = "plotButton" + gradesButton.id.substring(
            gradesButton.id.length - 4,
            gradesButton.id.length
        )
        plotButton.innerText = "📊"
        plotButton.addEventListener("click", () => {
            alert("You clicked button " + plotButton.id)
        })
        
        const wrapper = document.createElement("td")
        wrapper.appendChild(plotButton)
        
        row.insertAdjacentElement("beforeend", wrapper);
    }
}

insertPlotButtons()