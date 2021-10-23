import Notes from './notes.js';
const notes = new Notes();

export default class UI {

    constructor() {
        this.modal = document.querySelector('.addEdit-modal');
        this.backdrop = document.querySelector('.backdrop');
        this.floatingButton = document.querySelector('.add-note-button');
        this.notesContainer = document.querySelector('.notes-container');
        
        //edit mode
        this.EDIT_MODE = false;
        //title to update
        this.TITLE_TO_UPDATE = '';

        //Modal event listeners
        this.confirmFunction = this.addNoteToDOM.bind(this);
        this.cancelFunction = this.closeBackdropAndModal.bind(this);

        //Initial Handler's
        this.floatingButtonClickHandler();
        this.containerClickHandler();
    }

    modalButtonsClickHandler() {
        this.modal.querySelector('.modal-confirm').addEventListener('click', this.confirmFunction);
        this.modal.querySelector('.modal-cancel').addEventListener('click', this.cancelFunction);
    }

    clearInput() {
        const inputs = this.modal.querySelectorAll('.tit');
        const textAreas = this.modal.querySelectorAll('.desc');
        inputs.forEach(input => input.value = '');
        textAreas.forEach(textArea => textArea.value = '');
    }

    closeBackdropAndModal() {
        this.backdrop.classList.add('invisible');
        this.modal.classList.add('invisible');
        this.notesContainer.classList.remove('blur');
        //Clear modal inputs
        this.clearInput();
        //Remove event listeners
        this.modal.querySelector('.modal-confirm').removeEventListener('click', this.confirmFunction);
        this.modal.querySelector('.modal-cancel').removeEventListener('click', this.cancelFunction);
        // reset global variables
        this.EDIT_MODE = false;
        this.TITLE_TO_UPDATE = '';
    }

    openBackdropAndModal(title = null, description = null) {
        this.backdrop.classList.remove('invisible');
        this.modal.classList.remove('invisible');
        this.notesContainer.classList.add('blur');
        this.backdrop.addEventListener('click', this.closeBackdropAndModal.bind(this));

        //Fill the fields to update with previous value.
        if (this.EDIT_MODE === true) {
            this.modal.querySelector('.tit').value = title;
            this.modal.querySelector('.desc').value = description;
            this.TITLE_TO_UPDATE = title;
        }
        //Re-add event listeners
        this.modalButtonsClickHandler();
    }

    buildNoteDate() {
        const dateObj = new Date();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'Febraury', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Dicember'];
        const date = {
            day: days[dateObj.getDay()],
            month: months[dateObj.getMonth()]
        };
        return date;
    }

    addNoteToDOM() {
        const previousTitle = this.TITLE_TO_UPDATE;
        const noteTitle = this.modal.querySelector('.tit').value;
        const noteDescription = this.modal.querySelector('.desc').value;
        const date = this.buildNoteDate();
        const { day, month } = date;

        //Validate inputs
        if (noteTitle === '' || noteDescription === '') {
            alert('You must fill all the fields.');
            return;
        }

        //Create note object
        const noteObject = {
            title: noteTitle,
            description: noteDescription,
            dayOfCreation: day,
            monthOfCreation: month
        }

        //Note Element
        const note = document.createElement('div');
        note.className = 'note';

        //Note info field (Note element child)
        const noteInfoField = document.createElement('div');
        noteInfoField.className = 'note-info-field';
        noteInfoField.innerHTML = `
            <h2>${noteTitle}</h2>
            <p>${noteDescription}</p>
        `;

        //Note date (Note element child)
        const noteDateField = document.createElement('div');
        noteDateField.className = 'note-date-field';
        noteDateField.textContent = `${month} ${day}`;

        //Note buttons field (Note element child)
        const noteButtonsField = document.createElement('div');
        noteButtonsField.className = 'buttons-field';
        noteButtonsField.innerHTML = `
            <button class="edit-button"><i class="fas fa-edit"></i></button>
            <button class="trash-button"><i class="fas fa-trash"></i></button>
        `;

        //Build note component
        note.appendChild(noteInfoField);
        note.appendChild(noteDateField);
        note.appendChild(noteButtonsField);

        //Handle edit mode
        if (this.EDIT_MODE) {
            this.removeNoteFromDOM(previousTitle);
            this.EDIT_MODE = false;
            this.TITLE_TO_UPDATE = '';
        }
        
        //Add the note to the DOM
        this.notesContainer.appendChild(note);

        //Add the note to the list
        notes.addNote(noteObject);

        //Close modal
        this.closeBackdropAndModal();
    }

    floatingButtonClickHandler() {
        this.floatingButton.addEventListener('click', this.openBackdropAndModal.bind(this));
    }

    removeNoteFromDOM(title) {
        const indexToRemove = notes.removeNote(title);
        this.notesContainer.children[indexToRemove].remove();
    }

    containerClickHandler() {
        
        this.notesContainer.addEventListener('click', (e) => {
            
            if (e.target.classList.contains('trash-button')) {
                
                let title = e.target.parentElement.previousElementSibling.previousElementSibling.children[0].textContent;
                this.removeNoteFromDOM(title);

            } else if (e.target.classList.contains('edit-button')) {

                // Get the values to fill the modal
                let title = e.target.parentElement.previousElementSibling.previousElementSibling.children[0].textContent;
                let description = e.target.parentElement.previousElementSibling.previousElementSibling.children[1].textContent;
                
                this.EDIT_MODE = true;
                this.openBackdropAndModal(title, description).bind(this);
            }

        });

    }
}