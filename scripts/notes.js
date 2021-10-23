export default class Notes {

    constructor () {
        this.items = [];
    }

    addNote(note) {
        this.items.push(note);
    }

    removeNote(title) {
        const index = this.items.findIndex( item => item.title === title);
        this.items.splice(index,1);

        return index;
    }
}