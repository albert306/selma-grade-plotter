async function fetchGradesDetailPage(gradesButtonLink) {
    try {
        const response = await fetch(gradesButtonLink)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
        
        return await response.text()

    } catch (error) {
        console.error(error.message)
        return null
    }
}

class GradeOverviewData {
    moduleName
    examName
    myGrade
    average
    totalResults
    missingHtmlText
    resultLabels
    resultCounts

    constructor(){
        this.resultLabels = []
        this.resultCounts = []
    }
}

function extractData(html) {
    const data = new GradeOverviewData()

    const moduleRegex = /<b>Modul \/ Veranstaltung:<\/b>([\s\S]*?)<\//gm
    data.moduleName = moduleRegex.exec(html)[1].trim()

    const examRegex = /<b>Prüfungsleistung:<\/b>([\s\S]*?)<\//gm
    data.examName = examRegex.exec(html)[1].trim()

    const averageRegex = /<b>Durchschnitt:<\/b>([\s\S]*?)<\//gm
    data.average = averageRegex.exec(html)[1].trim()

    const totalResultsRegex = /<b>Vorliegende Ergebnisse:<\/b>([\s\S]*?)<\//gm
    data.average = totalResultsRegex.exec(html)[1].trim()

    const missingTextRegex = /<b>Fehlend:<\/b>[\s\S]*?<\/ul>/gm
    const optMissingText = missingTextRegex.exec(html)
    if (optMissingText !== null) {
        data.missingHtmlText = optMissingText[0]
    }

    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html

    const tableBody = tempDiv.getElementsByTagName('tbody')[0]
    const rows = tableBody.getElementsByTagName("tr")

    for (var i = 0; i < rows.length; i++) {
        const label = rows[i].cells[0].innerText
        data.resultLabels.push(parseFloat(label.replace(',', '.')))

        var count = rows[i].cells[1].innerText
        if (count == "---") {
            count = 0
        } else {
            count = parseInt(count)
        }
        data.resultCounts.push(count)
    }

    tempDiv.remove()

    return data
}

function drawPlot(htmlId, gradeOverviewData) {
    const data = [{
        x: gradeOverviewData.resultLabels,
        y: gradeOverviewData.resultCounts,
        type: "bar",
        orientation: "h",
        marker: {color:"rgba(255,0,0,0.6)"}
    }]
    
    const layout = {
        title: "Notenspiegel"
    }

    Plotly.newPlot(htmlId, data, layout)
}