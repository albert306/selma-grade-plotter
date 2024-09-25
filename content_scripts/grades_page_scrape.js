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
    myGrade
    infoHtmlText
    resultLabels
    resultCounts

    constructor(){
        this.resultLabels = []
        this.resultCounts = []
    }
}

function extractData(html) {
    const data = new GradeOverviewData()

    const infoHtmlTextRegex = /(<h2>[\s\S]*)?<div class="tb">/g
    data.infoHtmlText = infoHtmlTextRegex.exec(html)[1].trim()
    
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html

    const tableBody = tempDiv.getElementsByTagName('tbody')[0]
    const rows = tableBody.getElementsByTagName("tr")

    const INCLUDED_GRADES = ["1,00", "1,30", "1,70", "2,00", "2,30", "2,70", "3,00", "3,30", "3,70", "4,00", "5,00", "be", "nb"]

    for (var i = 0; i < rows.length; i++) {
        const label = rows[i].cells[0].innerText
        if (!INCLUDED_GRADES.includes(label)) {
            continue
        }
        data.resultLabels.push(label)

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