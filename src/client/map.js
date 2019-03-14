export default class Map{
    constructor(rows, columns){
        this.rows = rows;
        this.columns = columns;

        this.mapArray = new Array(this.rows).fill(0).map(()=>new Array(this.columns).fill(0));
    };
}
