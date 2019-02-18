export class Tag {
    display;
    readonly;
    constructor(public value, readonly = true) {
        this.display = value;
        this.readonly = readonly;
    }
}
