export class Tag {
    display;
    readonly;
    constructor(public value, readonly = true) {

        if ( value instanceof Object ) {
            this.display = value.display;
            this.readonly = !!value.readonly;
            return;
        }

        this.display = value;
        this.readonly = readonly;
    }
}
