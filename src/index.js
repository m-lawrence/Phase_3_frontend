const hikeNamesDiv = document.querySelector('div#hike-names')
const displayDiv = document.querySelector('div#display-div')
const loginForm = document.querySelector('form#login-form')
const myHikesUl = document.querySelector('ul.my-hikes-ul')

function renderOneName(hikeObj) {
    const nameSpan = document.createElement('span')
    nameSpan.classList.add('hike-name-span')
    nameSpan.dataset.id = hikeObj.id

    nameSpan.textContent = hikeObj.name 

    hikeNamesDiv.append(nameSpan)
}

function renderAllNames() {
    fetch('http://localhost:3000/hikes')
        .then(response => response.json())
        .then(hikesArr => hikesArr.forEach(renderOneName))
}

hikeNamesDiv.addEventListener('click', event => {
    let currentId = event.target.dataset.id
    if (event.target.className === 'hike-name-span') {
        getHikeInfo(currentId)
    }
})

function getHikeInfo(id) {
    fetch(`http://localhost:3000/hikes/${id}`)
        .then(response => response.json())
        .then(objInfo => displayHike(objInfo))
}

function displayHike(hikeObj) {
    const displayName = document.querySelector('h2.display-name')
    const displayImg = document.querySelector('img.display-img')
    const displayLocation = document.querySelector('h4.display-location')
    const displayDifficulty = document.querySelector('p.display-difficulty')
    const displayDistance = document.querySelector('p.display-distance')
    const displayRating = document.querySelector('p.display-rating')
    const revContainer = document.querySelector('div#rev-container')
    revContainer.innerHTML = ""

    displayName.textContent = hikeObj.name
    displayImg.src = hikeObj.image
    displayImg.alt = hikeObj.name 
    displayLocation.textContent = hikeObj.location 
    displayDifficulty.textContent = `Difficulty: ${hikeObj.difficulty}`
    displayDistance.textContent = `Distance: ${hikeObj.distance} miles`
    if (hikeObj.averagerating === 1){displayRating.textContent = "Rating: ⭐️"}
    else if (hikeObj.averagerating === 2){displayRating.textContent = "Rating: ⭐️⭐️"}
    else if (hikeObj.averagerating === 3){displayRating.textContent = "Rating: ⭐️⭐️⭐️"}
    else if (hikeObj.averagerating === 4){displayRating.textContent = "Rating: ⭐️⭐️⭐️⭐️"}
    else if(hikeObj.averagerating === 5){displayRating.textContent = "Rating: ⭐️⭐️⭐️⭐️⭐️"}
  
    hikeObj.hikereviews.forEach( review => {
        const revDiv = document.createElement('div')
        revDiv.classList.add('rev-div')
        const revUser = document.createElement('p')
        revUser.classList.add('rev-user')
        const revRating = document.createElement('h4')
        revRating.classList.add('rev-rating')
        const revDescription = document.createElement('p')
        revDescription.classList.add('rev-description')
        console.log(review)
        revUser.textContent = `Reviewed by: ${review.username}`
        revRating.textContent = `Rating: ${review.rating}`
        revDescription.textContent = review.description 

        revContainer.append(revDiv)
        revDiv.append(revUser)
        revDiv.append(revRating)
        revDiv.append(revDescription)
    })
    
}

function renderOneMyHike(hikeObj) {
    
    const myHikesLi = document.createElement('li')
    myHikesLi.classList.add('my-hikes-li')
    myHikesLi.dataset.id = hikeObj.id

    myHikesLi.textContent = hikeObj.name 

    myHikesUl.append(myHikesLi)
}

function renderAllMyHikes(id) {
    myHikesUl.innerHTML = ""
    fetch(`http://localhost:3000/users/${id}`)
        .then(response => response.json())
        .then(user => user.myhikes.forEach(hike => {
           renderOneMyHike(hike)
        }))
}

loginForm.addEventListener('submit', event => {
    event.preventDefault()

    let currUser = event.target.name.value
    getUserByName(currUser)

    loginForm.reset()
   
})

function getUserByName(name) {
    fetch(`http://localhost:3000/users`)
    .then(response => response.json())
    .then(usersArr => getUserName(usersArr, name))
}

function getUserName(usersArr, name) {
    let currUser = usersArr.find(user => user.name === name)
    renderAllMyHikes(currUser.id)
}

myHikesUl.addEventListener('click', event => {
    if (event.target.className = 'my-hikes-li') {
        let id = event.target.dataset.id
        fetch(`http://localhost:3000/hikes/${id}`)
            .then(response => response.json())
            .then(displayHike)
    }
})


renderAllNames()
// renderAllMyHikes(12)