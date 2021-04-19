const hikeNamesDiv = document.querySelector('div#hike-names')

function renderOneName(hikeObj) {
    const nameSpan = document.createElement('span')

    nameSpan.textContent = hikeObj.name 

    hikeNamesDiv.append(nameSpan)
}

function renderAllNames() {
    fetch('http://localhost:3000/hikes')
        .then(response => response.json())
        .then(hikesArr => hikesArr.forEach(renderOneName))
}

renderAllNames()