
var files;
var pastedText;
var results = [];

function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    files = evt.dataTransfer.files; 
    var textArea = document.getElementById('status');
    var textMain = document.getElementById('output');
    
    var fileNameString = 'Files Loaded: \n\n';
    for (var i = 0; i < Object.keys(files).length; i++){
      fileNameString += files[i].name + '\n';
    }
  
    textArea.value = fileNameString;
    textMain.value = '';
    pastedText = '';
  
    console.log(files);
    
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; 
}

function handlePaste(){
  setTimeout(function(){
    pastedText = document.getElementById('output').value;
    files = null;
    
  }, 30);
}

document.getElementById('search').addEventListener('keyup', function(e){
  if(e.keyCode === 13){
    search();
  }
});

 
var dropZone = document.getElementById('output');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);
dropZone.addEventListener('paste', handlePaste, false);



function search(){
  results = [];
  
  var term = document.getElementById('search').value.split(',');
  
  if(files){
    document.getElementById('output').value = '';
    for (var i = 0; i < Object.keys(files).length; i++){
      document.getElementById('status').value = 'Searching...';
      readFile(files[i], term);
    }    
  } else {
      
      document.getElementById('output').value = '';
      document.getElementById('status').value = 'Searching...';
      parse(pastedText, term, null);
  }
      
}

function searchResults(){

  if(results.length){
    console.log('what');
    results = [];
    var resultsText = document.getElementById('output').value;
    var term = document.getElementById('search').value.split(',');
    document.getElementById('output').value = '';
    document.getElementById('status').value = 'Searching...';

    parse(resultsText, term, null);
  } else {

    document.getElementById('status').value = "There are no current results to search";



  }
}


function readFile(file, term){
  
  
    var reader = new FileReader();
  
     reader.onload = (function(theFile) {
        return function(e) {
          
          parse(e.target.result, term, file);
           
        };
      })(file);
  
     reader.readAsText(file);    
              
      
}

function parse(text, term, file){
  
  var parsed = text.split('\n');
  var filtered = [];
  var searchType = document.querySelector('.check:checked').value;
  
  if(searchType === 'or'){
    parsed.forEach(function(x){
      term.forEach(function(y){
         if(x.toLowerCase().indexOf(y.toLowerCase()) !== -1){
          
            if(!checkArray(filtered, x)){
              filtered.push(x);
            }
         }
                 
      });
    });
    
  } else {
    parsed.forEach(function(t){
      var allMatched;
      for(var i = 0; i < term.length; i++){
         if(t.toLowerCase().indexOf(term[i].toLowerCase()) !== -1){
           allMatched = true;         
            
         } else {
           allMatched = false;
           break;
         }
                 
      }
      if(allMatched && !checkArray(filtered, t)){
           filtered.push(t);
      }
    });   
  }
  resultsData(filtered, term, file);
  addToTextArea(filtered);
}

function resultsData(arr, term, file){
  var fileName = (file) ? file.name : 'text'; 
  
  if(arr){
    term.forEach(function(x){
      var termObject = {name: x};
      var number = 0;
      arr.forEach(function(y){        
        if (y.toLowerCase().indexOf(x.toLowerCase()) !== -1){
          number++;
        }      
      });
      termObject.number = (number > 0) ? number : 'No';
      termObject.file = fileName;
      results.push(termObject);
    });
    console.log(results);
    
     
    console.log(fileName);
  
    var resultsArea = document.getElementById('status');
    
    var resultsString = 'Search Results: \n\n';
    results.forEach(function(item){
      var matches = (item.number === 1) ? 'match' : 'matches';
      resultsString += '\'' + item.name + '\'' + ' --- ' + item.number + ' ' + matches + ' found in ' + item.file + '\n';
    });

    resultsArea.value = resultsString;
    resultsArea.textContent = resultsString;
  }
  
}

function addToTextArea(arr){
  var textArea = document.getElementById('output');
  var resultsArea = document.getElementById('status');
  var outputString = textArea.value;
  
  arr.forEach(function(item){
    outputString += item + '\n';    
  });
  
  textArea.value = outputString;
  
}


function checkArray(arr, line){
  var exists;
  for(var x = 0; x < arr.length; x++){
    
    if(arr[x].indexOf(line) !== -1){
       exists = true;
      break;
    }
  }
  return exists;
}

