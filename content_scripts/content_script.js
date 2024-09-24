function insertPlotButtons() {
    document.getElementsByClassName("tbsubhead")[0].insertAdjacentHTML("beforeend", "<th></th>")

    const examResultRows = document.getElementsByClassName("tbdata")

    for (let i = 0; i < examResultRows.length; i++) {
        const row = examResultRows[i]

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
            onPlotButtonClick(gradesButton)
        })

        const wrapper = document.createElement("td")
        wrapper.appendChild(plotButton)
        
        row.insertAdjacentElement("beforeend", wrapper);
    }
}

async function onPlotButtonClick(gradesButton) {
    const gradesButtonScript = gradesButton.parentElement.getElementsByTagName("script")[0]
    if (gradesButtonScript == null) return
    const hrefRegex = /&ARGUMENTS=([\s\S]*)","Gradeoverview"/g
    const hrefArguments = hrefRegex.exec(gradesButtonScript.innerText)[1]
    const href = "https://selma.tu-dresden.de/APP/GRADEOVERVIEW/" + hrefArguments
    
    const detailPageHtml = await fetchGradesDetailPage(href)
    if (detailPageHtml == null) {
        return
    }
    
    alert(JSON.stringify(extractData(detailPageHtml)))
}

insertPlotButtons()