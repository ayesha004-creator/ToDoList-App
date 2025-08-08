document.getElementById('form').addEventListener('submit', (event) => {
    event.preventDefault();  //prevent default submission behavior

    const title = document.getElementById('title').value;
    const detail = document.getElementById('disc').value;
    const id = document.getElementById('edit-id').value || Date.now().toString();
    //generate id or also use existing id

    const cardM = createCard(id, title, detail, false);// initial not done


    if (document.getElementById('edit-id').value) {
        const existingCard = document.querySelector(`.card[data-id='${id}']`);  // this will find card by id from DOM
        if (existingCard && existingCard.parentElement) {
            existingCard.parentElement.replaceWith(cardM);     // replacing card
        }
    } else {
        document.getElementById('item-container').prepend(cardM); // add to DOM if new card
    }

    document.getElementById('form').reset(); // reset form
    document.getElementById('edit-id').value = ''; // reset hidden input
    saveToLocalStorage(id, title, detail, false);

    // this will close the modal after action
    const closeModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('exampleModal'));
    closeModal.hide();
});

//    FUNCTION TO CREATE CARD
function createCard(id, title, detail, isDone) {
    const cardM = document.createElement('div');
    cardM.className = 'col-lg-4 col-sm col-md-6 mb-3';
    cardM.innerHTML = `
        <div class="card h-100" data-id="${id}">
            <div class="card-header d-flex  justify-content-between">
             <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="editCard('${id}')">Edit</button>
             <button type="button" class="btn btn-sm " onclick="viewDetails('${id}')">
              <img src="../CSS/images-folder/eye-icon.svg" alt="Eye" style="width:20px; height:20px;">
             </button>
            </div>
          <img src="../CSS/images-folder/nature.jpeg" class="card-img-top rounded-circle" alt="Image">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${detail}</p>
            <a href="#" class="btn btn-${isDone ? 'success' : 'danger'} mark-as-done">${isDone ? 'Completed' : 'Mark as done'}</a>
            <button type="button" class="btn btn-danger ms-2 remove-btn">Remove</button>
          </div>
        </div>
      `;

    const markAsDoneBtn = cardM.querySelector('.mark-as-done');
    markAsDoneBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const completed = markAsDoneBtn.textContent === 'Completed';
        markAsDoneBtn.textContent = completed ? 'Mark as done' : 'Completed';
        markAsDoneBtn.classList.toggle('btn-success');
        markAsDoneBtn.classList.toggle('btn-danger');
        updateLocalStorage(id, title, detail, !completed);
    });

    // remove buttton listener
    const removeButton = cardM.querySelector('.remove-btn');
    removeButton.addEventListener('click', () => {
        cardM.remove();  // remove card from DOM 
        removeFromLocalStorage(id);   // remove from local Storage
    });

    return cardM;
}

//     Function For Store in Local Storage
function saveToLocalStorage(id, title, detail, isDone) {
    const items = JSON.parse(localStorage.getItem('items')) || [];
    //existing task retrieve or initialize an emoty array

    const existingIndex = items.findIndex(item => item.id === id);

    //update existing item
    if (existingIndex > -1) {
        items[existingIndex] = { id, title, detail, done: isDone };
    }
    else {
        // add new item
        items.push({ id, title, detail, done: isDone });
    }
    localStorage.setItem('items', JSON.stringify(items));
    // save updated array to local storage
}

//  updating local storage
function updateLocalStorage(id, title, detail, isDone) {
    let items = JSON.parse(localStorage.getItem('items')) || [];
    items = items.map(item => {
        if (item.id == id) {
            // update id title detail
            item.done = isDone;
            item.title = title;
            item.detail = detail;
        }
        return item;
    });
    localStorage.setItem('items', JSON.stringify(items));  // save update array in loca storage
}

function removeFromLocalStorage(id) {
    let items = JSON.parse(localStorage.getItem('items')) || [];
    items = items.filter(item => item.id !== id); // filtering removed item
    localStorage.setItem('items', JSON.stringify(items));  // save update array in loca storage
}

//   Function to Edit the Card 
function editCard(id) {
    const items = JSON.parse(localStorage.getItem('items')) || [];

    const itemToEdit = items.find((item) => item.id == id);

    if (itemToEdit) {
        // open modal
        const ModalContent = document.getElementById('exampleModal');
        const modalOpen = bootstrap.Modal.getOrCreateInstance(ModalContent);
        modalOpen.show();

        setTimeout(() => {
            document.getElementById('title').value = itemToEdit.title;
            document.getElementById('disc').value = itemToEdit.detail;
            document.getElementById('edit-id').value = itemToEdit.id;
        }, 100);
    }
}

function resetForm() {
    document.getElementById('form').reset();
    document.getElementById('edit-id').value = '';
}

//   Function for Viewing Information
function viewDetails(id) {
    const items = JSON.parse(localStorage.getItem('items')) || [];
    const itemToView = items.find(item => item.id === id);

    if (itemToView) {
        document.getElementById('viewDetailsContent').innerHTML = `
        <h4>${itemToView.title}</h4>
        <p>${itemToView.detail}</p>
        `;

        // After content add in modal show the modal
        const viewModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('viewDetailsModal'));
        viewModal.show();
    }
}

function loadItemsLS() {
    const items = JSON.parse(localStorage.getItem('items')) || [];

    items.forEach(item => {
        const cardM = createCard(item.id, item.title, item.detail, item.done);
        document.getElementById('item-container').prepend(cardM)
    });
}

window.onload = loadItemsLS;
