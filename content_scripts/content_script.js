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

function injectPopUpDiv() {
    const overlay = document.createElement("div")
    overlay.id = "overlay"
    
    const popUp = document.createElement("div")
    popUp.id = "popUp"

    const closeButton = document.createElement("a")
    closeButton.id = "closeButton"
    closeButton.href = "#"
    closeButton.innerText = "×"
    closeButton.addEventListener("click", () => {
        overlay.style.display = "none"
    })

    popUp.appendChild(closeButton)
    overlay.appendChild(popUp)

    document.body.appendChild(overlay)
}

async function onPlotButtonClick(gradesButton) {
    const overlay = document.getElementById("overlay");
    // prevent repeated calls
    if (overlay.style.display === "block") {
        return
    }
    overlay.style.display = "block"
    
    const gradesButtonScript = gradesButton.parentElement.getElementsByTagName("script")[0]
    if (gradesButtonScript == null) return
    const hrefRegex = /&ARGUMENTS=([\s\S]*)","Gradeoverview"/g
    const hrefArguments = hrefRegex.exec(gradesButtonScript.innerText)[1]
    const href = "https://selma.tu-dresden.de/APP/GRADEOVERVIEW/" + hrefArguments
    
    const detailPageHtml = await fetchGradesDetailPage(href)
    if (detailPageHtml == null) {
        return
    }
    const data = extractData(detailPageHtml)

    const barChart = createBarChartElement(data.resultLabels, data.resultCounts)
    document.getElementById("popUp").appendChild(barChart)
}

injectPopUpDiv()
insertPlotButtons()