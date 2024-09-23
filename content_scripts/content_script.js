function insertPlotButtons() {
    document.getElementsByClassName("tbsubhead")[0].insertAdjacentHTML("beforeend", "<th></th>")

    const examResultRows = document.getElementsByClassName("tbdata")

    for (let i = 0; i < examResultRows.length; i++) {
        const row = examResultRows[i];

        var gradesButton = row.getElementsByClassName("link")[0]
        if (gradesButton == null) {
            continue
        }
        row.insertAdjacentHTML(
            "beforeend",
            "<td>📊</td>",
        );
    }
}

insertPlotButtons()