const hikeNamesDiv = document.querySelector('div#hike-names')
const displayDiv = document.querySelector('div#display-div')
const loginForm = document.querySelector('form#login-form')
const myHikesUl = document.querySelector('ul.my-hikes-ul')
const newRevForm = document.querySelector('form#new-review-form')
const revContainer = document.querySelector('div#rev-container')

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
    
    revContainer.innerHTML = ""

    displayDiv.dataset.hikeId = hikeObj.id
    displayName.textContent = hikeObj.name
    displayImg.src = hikeObj.image
    displayImg.alt = hikeObj.name 
    displayLocation.textContent = hikeObj.location 
    displayDifficulty.textContent = `Difficulty: ${hikeObj.difficulty}`
    displayDistance.textContent = `Distance: ${hikeObj.distance} miles`
    if (hikeObj.averagerating === 1){displayRating.textContent = "Average Rating: ⭐️"}
    else if (hikeObj.averagerating === 2){displayRating.textContent = "Average Rating: ⭐️⭐️"}
    else if (hikeObj.averagerating === 3){displayRating.textContent = "Average Rating: ⭐️⭐️⭐️"}
    else if (hikeObj.averagerating === 4){displayRating.textContent = "Average Rating: ⭐️⭐️⭐️⭐️"}
    else if(hikeObj.averagerating === 5){displayRating.textContent = "Average Rating: ⭐️⭐️⭐️⭐️⭐️"}
  
    hikeObj.reviews.forEach( review => {
        const revDiv = document.createElement('div')
        revDiv.classList.add('rev-div')
        const revRating = document.createElement('h4')
        revRating.classList.add('rev-rating')
        const revUser = document.createElement('p')
        revUser.classList.add('rev-user')
        const revDescription = document.createElement('p')
        revDescription.classList.add('rev-description')
        const editBtn = document.createElement('button')
        editBtn.classList.add('edit-rev')
        const deleteBtn = document.createElement('button')
        deleteBtn.classList.add('delete-rev')
        revRating.textContent = `Rating: ${review.rating}`
        revUser.textContent = `Reviewed by: ${review.username} ${review.date}`
        revDescription.textContent = `"${review.description}"` 
        editBtn.textContent = "Edit"
        deleteBtn.textContent = "Delete"

        revDiv.append(revRating, revUser, revDescription, editBtn, deleteBtn)
        revContainer.append(revDiv)
    })
    
}

function renderOneMyHike(hikeObj) {
    const h2MyHikes = document.querySelector("#my-hikes h2")
    h2MyHikes.textContent = "My hikes:"
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
    newRevForm.dataset.userId = currUser.id 
}

myHikesUl.addEventListener('click', event => {
    if (event.target.className = 'my-hikes-li') {
        let id = event.target.dataset.id
        fetch(`http://localhost:3000/hikes/${id}`)
            .then(response => response.json())
            .then(displayHike)
    }
})


newRevForm.addEventListener('submit', event => {
    event.preventDefault()
    const ratingInput = event.target.rating.value 
    const descriptionInput = event.target.description.value

    const newRev = {
        rating: parseInt(ratingInput),
        description: descriptionInput,
        user_id: parseInt(newRevForm.dataset.userId),
        hike_id: parseInt(displayDiv.dataset.hikeId)
    }

    const addRevDiv = document.createElement('div')
    addRevDiv.classList.add('rev-div')
    const addRevRating = document.createElement('h4')
    addRevRating.classList.add('rev-rating')
    const addRevUser = document.createElement('p')
    addRevUser.classList.add('rev-user')
    const addRevDescription = document.createElement('p')
    addRevDescription.classList.add('rev-description')
    const addeditBtn = document.createElement('button')
    addeditBtn.classList.add('edit-rev')
    const addDeleteBtn = document.createElement('button')
    addDeleteBtn.classList.add('delete-rev')
    addRevRating.textContent = `Rating: ${ratingInput}`
    addRevUser.textContent = `Reviewed by: ${newRev.username} ${newRev.date}`
    addRevDescription.textContent = `"${descriptionInput}"` 
    addeditBtn.textContent = "Edit"
    addDeleteBtn.textContent = "Delete"
    
   
    addRevDiv.append(addRevRating, addRevUser, addRevDescription, addeditBtn, addDeleteBtn)
    revContainer.append(addRevDiv)


    fetch('http://localhost:3000/reviews', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(newRev)
    })
    .then(response => response.json())
    .then(console.log)
})

// function getCurrUser(id, newRev) {
//     fetch(`http://localhost:3000/users/${id}`)
//         .then(response => response.json())
//         .then(userObj => postNewReview(userObj, newRev))
// }

// function postNewReview(userObj, newRev) {
    
//     fetch('http://localhost:3000/reviews', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//     },
//     body: JSON.stringify(newRev)
//     })
//    .then(response => response.json())
//    .then(console.log)
  

//     const addRevDiv = document.createElement('div')
//     addRevDiv.classList.add('rev-div')
//     const addRevRating = document.createElement('h4')
//     addRevRating.classList.add('rev-rating')
//     const addRevUser = document.createElement('p')
//     addRevUser.classList.add('rev-user')
//     const addRevDescription = document.createElement('p')
//     addRevDescription.classList.add('rev-description')
//     const addeditBtn = document.createElement('button')
//     addeditBtn.classList.add('edit-rev')
//     const addDeleteBtn = document.createElement('button')
//     addDeleteBtn.classList.add('delete-rev')
//     addRevRating.textContent = `Rating: ${newRev.rating}`
//     addRevUser.textContent = `Reviewed by: ${userObj.name} ${newRev.date}`
//     addRevDescription.textContent = `"${newRev.description}"` 
//     addeditBtn.textContent = "Edit"
//     addDeleteBtn.textContent = "Delete"
    
   
//     addRevDiv.append(addRevRating, addRevUser, addRevDescription, addeditBtn, addDeleteBtn)
//     revContainer.append(addRevDiv)
// }

renderAllNames()
getHikeInfo(22)

