export default class Pointer{
    constructor(){
        this.pointerStates = {
            Zone: 1,
            Place: 2,
            Select: 3
        };
        this.dragboxCoords = [0, 0, 0, 0];
        this.drag = false
    };
}
