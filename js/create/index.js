'use strict';

const modules = require('../module');

const getNumRows = () => {
    var row_field = document.getElementById("numRows");
    return row_field.value;
};

const getNumColumns = () => {
    var column_field = document.getElementById("numColumns");
    return column_field.value;
};

const fauxData = (r, c) => {
    var arr = new Array(r);
    for (var i = 0; i < c; i++) {
        arr[i] = new Array(c);
    }

    for (var i = 0; i < r; i++) {
        for(var j = 0; j < c; j++){
            arr[i][j] = 0;
        }
    }
    return arr;
};

const makeInputFields = () =>{

    var table = document.querySelector('.mtbl-table');

    var numRows = getNumRows();
    var numColumns = getNumColumns();

    for(var i = 0; i < numRows; i++){
        for(var j = 0; j < numColumns; j++){
            var elem = document.createElement('input');
            elem.type = 'Number';
            elem.value = 1;
            elem.classList.add('mtbl-col','inputField');
            table.childNodes[i].childNodes[j].innerHTML = '';
            table.childNodes[i].childNodes[j].appendChild(elem);
        }
    }

};

const setupButtons = () => {

    var button_2DMatrix = document.getElementById("button-2DMatrix");
    button_2DMatrix.addEventListener('click',function(){
        var arr2DTracer = new modules.Array2DTracer();
        var numRows = getNumRows();
        var numColumns = getNumColumns();
        var data = fauxData(numRows, numColumns);

        arr2DTracer.setData(data);
        makeInputFields();
    },false);
};

module.exports = {
    setupButtons
};
