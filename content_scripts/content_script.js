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
    overlay.style.position = "fixed"
    overlay.style.top = "0"
    overlay.style.right = "0"
    overlay.style.left = "0"
    overlay.style.bottom = "0"
    overlay.style.zIndex = "999"
    overlay.style.background = "rgba(0, 0, 0, 0.7)"
    overlay.style.display = "none"
    
    const popUp = document.createElement("div")
    popUp.id = "popUp"
    popUp.style.width = "80%"
    popUp.style.height = "80%"
    popUp.style.padding = "20px"
    popUp.style.margin = "70px auto"
    popUp.style.background = "#fff"
    popUp.style.borderRadius = "5px"
    popUp.style.position = "relative"

    const closeButton = document.createElement("a")
    closeButton.href = "#"
    closeButton.innerText = "×"
    closeButton.style.position = "absolute"
    closeButton.style.top = "20px"
    closeButton.style.right = "30px"
    closeButton.style.fontSize = "30px"
    closeButton.style.fontWeight = "bold"
    closeButton.addEventListener("click", () => {
        overlay.style.display = "none"
    })

    popUp.appendChild(closeButton)
    overlay.appendChild(popUp)

    document.body.appendChild(overlay)
}

async function onPlotButtonClick(gradesButton) {
    const overlay = document.getElementById("overlay");
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

    drawBarChart("popUp", data.resultLabels, data.resultCounts)
}

injectPopUpDiv()
insertPlotButtons()