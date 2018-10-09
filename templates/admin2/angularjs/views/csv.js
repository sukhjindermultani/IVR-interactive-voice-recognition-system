var A = [['n','sqrt(n)']];

for(var j=1; j<10; ++j){ 
    A.push([j, Math.sqrt(j)]);
}

var csvRows = [];

for(var i=0, l=A.length; i<l; ++i){
    csvRows.push(A[i].join(','));
}

var csvString = csvRows.join("%0A");
var a         = document.createElement('a');
a.href        = 'data:attachment/csv,' + csvString;
a.target      = '_blank';
a.download    = 'myFile.csv';

document.body.appendChild(a);
a.click();