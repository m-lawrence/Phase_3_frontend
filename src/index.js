const hikeNamesDiv = document.querySelector('div#hike-names')
const displayDiv = document.querySelector('div#display-div')
const loginForm = document.querySelector('form#login-form')
const myHikesUl = document.querySelector('ul.my-hikes-ul')
const newRevForm = document.querySelector('form#new-review-form')
const revContainer = document.querySelector('div#rev-container')
const signUpForm = document.querySelector('form#signup-form')




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
        // const reviewUser = review.user
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
        revUser.textContent = `Reviewed by: ${review.username}`
        const revDate = document.createElement('p')
        revDate.classList.add('rev-date')
        revDate.textContent = `${review.date}`
        revDescription.textContent = `"${review.description}"` 
        editBtn.textContent = "Edit"
        deleteBtn.textContent = "Delete"

        const updateForm = document.createElement('form')
            updateForm.className = 'update-form'
            updateForm.innerHTML = `
            <br><input type="number" value= "${review.rating}"/><br>
            <textarea name="description" rows="4" cols="30" required></textarea><br>
            <input type="submit" value="Edit Review" />
            `
        updateForm.style.display = 'none'
      

        revDiv.append(revRating, revUser, revDate, revDescription, editBtn, deleteBtn, updateForm)
        revContainer.append(revDiv)
        revDiv.dataset.id = review.id
       
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
    newRevForm.style.display = "block"
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
    const loginDiv = document.querySelector('div#login-container')
    loginDiv.innerHTML = `<h3>Welcome, ${currUser.name}</h3>`
   
    // const editBtn = document.createElement('button')
    // editBtn.classList.add('edit-rev')
    // const deleteBtn = document.createElement('button')
    // deleteBtn.classList.add('delete-rev')
    // editBtn.textContent = "Edit"
    // deleteBtn.textContent = "Delete"

    // currUser.reviews.forEach(review => {
    //     const reviewDiv = element.getAttribute(`[dataset.id="${review.id}"]`)
    //     reviewDiv.append(editBtn, deleteBtn)})
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
    
    addRevDescription.textContent = `"${descriptionInput}"` 
    addeditBtn.textContent = "Edit"
    addDeleteBtn.textContent = "Delete"

    // const newReForm = document.createElement('form')
    // newReForm.className = 'update-form'
    // newReForm.innerHTML = `
    // <br><input type="number" value= "${newRev.rating}"/><br>
    // <textarea name="description" rows="4" cols="30" required></textarea><br>
    // <input type="submit" value="Edit Review" />
    // `
    // newReForm.style.display = 'none'
    
    
    addRevDiv.append(addRevRating, addRevUser, addRevDescription, addeditBtn, addDeleteBtn, newReForm)
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
    .then(data =>  {
        addRevUser.textContent = `Reviewed by: ${data.username} ${data.date}`
        addRevDiv.dataset.id = data.id
    })

   
})


signUpForm.addEventListener('submit', event => {
    event.preventDefault()
   
    const name = event.target.name.value
    const age = event.target.age.value 
    const location = event.target.location.value 
    newRevForm.style.display = "block"
   

    const userObj = {
        name,
        age,
        location
    }
   
    fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(userObj)
    })
        .then(response => response.json())
        .then(data => newRevForm.dataset.userId = data.id)

        
        signUpForm.reset()
})


revContainer.addEventListener("click", event => {
    
    const currentReview = event.target.closest("div")
   
    const reviewId = (currentReview.dataset.id)
    
    if (event.target.matches("button.delete-rev")){
        
        fetch(`http://localhost:3000/reviews/${reviewId}`,{
            method: "DELETE"
        })
        currentReview.remove()
    }
    else if (event.target.matches("button.edit-rev")){
       
        const editForm = currentReview.children[6]
        
        if (editForm.style.display ==="none"){editForm.style.display ="block"}
        else {editForm.style.display ="none"}

        
        
        editForm.addEventListener("submit", e => {
           
            e.preventDefault()
            let updatedH4Rating = e.target[0].value
            let displayRating = currentReview.children[0]
            displayRating.textContent = `Rating: ${e.target[0].value}`
            let oldPDescription = currentReview.children[3]
            oldPDescription.textContent = e.target[1].value
            let updatedDescription = e.target[1].value
            let updatedDate = currentReview.children[2]
           
            
            fetch(`http://localhost:3000/reviews/${reviewId}`,{
                method: "PATCH",
                headers: {"Content-type": "application/json", "Accept":"application/json"},
                body: JSON.stringify({rating: updatedH4Rating, description: updatedDescription})
            })
            .then(response => response.json())
            .then(data => updatedDate.textContent = data.date)
        })
              
        
    }
})

renderAllNames()
getHikeInfo(1)


