export default class Pointer{
    constructor(){
        this.pointerStates = {
            ZONE: 1,
            ROAD: 2,
            PLACE: 3,
            SELECT: 4
        };
        this.pointerState = this.pointerStates.ZONE;
        this.dragboxCoords = [0, 0, 0, 0];
        this.drag = false
    }

    setPointerState(newState) {
        this.pointerState = newState;
    };
}
