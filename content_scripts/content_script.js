function insertPlotButtons() {
    document.getElementsByClassName("tbsubhead")[0].insertAdjacentHTML("beforeend", "<th></th>")

    const examResultRows = document.getElementsByClassName("tbdata")

    for (let i = 0; i < examResultRows.length; i++) {
        const row = examResultRows[i]
        
        const myGrade = row.getElementsByTagName("td")[2].innerText

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
            onPlotButtonClick(myGrade, gradesButton)
        })

        const wrapper = document.createElement("td")
        wrapper.style.width = "60px"
        wrapper.appendChild(plotButton)
        
        row.insertAdjacentElement("beforeend", wrapper);
    }
}

function injectPopUpDiv() {
    const overlay = document.createElement("div")
    overlay.id = "overlay"
    overlay.addEventListener("click", (e) => {
        closePopUp()
        e.stopPropagation()
    })
    
    const popUp = document.createElement("div")
    popUp.id = "popUp"
    popUp.innerHTML = "<h1>Notenverteilung</h1>"

    const closeButton = document.createElement("a")
    closeButton.id = "closeButton"
    closeButton.href = "#"
    closeButton.innerText = "×"
    closeButton.addEventListener("click", closePopUp)

    const popUpContent = document.createElement("div")
    popUpContent.id = "popUpContent"

    popUp.appendChild(closeButton)
    popUp.appendChild(popUpContent)
    overlay.appendChild(popUp)

    document.body.appendChild(overlay)
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closePopUp()
        }
    })
}

function closePopUp() {
    const overlay = document.getElementById("overlay")
    const popUpContent = document.getElementById("popUpContent")
    if (overlay == null || popUpContent == null) {
        return
    }

    overlay.style.display = "none"
    popUpContent.innerHTML = ""
}

async function onPlotButtonClick(myGrade, gradesButton) {
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

    const popUpContent = document.getElementById("popUpContent")
    popUpContent.innerHTML = data.infoHtmlText
    popUpContent.appendChild(createBarChartElement(data.resultLabels, data.resultCounts, myGrade))
}

injectPopUpDiv()
insertPlotButtons()