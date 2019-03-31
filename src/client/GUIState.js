class PointerState{
    constructor(name, mode){
        this.name = name;
        this.mode = mode;
    }
}

export default class Pointer{
    constructor(){
        this.states = [new PointerState('Select', 'SELECT')];
        this.state = this.states[0];
        this.dragboxCoords = [0, 0, 0, 0];
        this.drag = false;
        this.zone = false;
        this.place = false;
        this.placed = false;
        this.transit = false;
    }

    setState(newState) {
        for(var x = 0; x < this.states.length; x++){
            if(newState == this.states[x].name){
                this.state = this.states[x];
            }
            switch(this.state.mode){
                case 'ZONE':
                    this.zone = true;
                    this.place = false;
                    this.transit = false;
                    break;
                case 'TRANSIT':
                    this.zone = false;
                    this.place = false;
                    this.transit = true;
                    break;
                case 'PLACE':
                    this.zone = false;
                    this.place = true;
                    this.transit = false;
                    break;
                default:
                    this.zone = false;
                    this.place = false;
                    this.transit = false;
            }
        }
    };
    addState(stateName, stateType) {
        for(var x = 0; x < this.states.length; x++){
            if(stateName == this.states[x].name){
                console.log("put error here for duplicate name");
                return;
            }
        }
        this.states[this.states.length] = new PointerState(stateName, stateType);
    };
}

