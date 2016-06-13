(function(){
  var files;
  var pastedText;
  var results = [];
  var searchTime;


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

  var searchButton = document.getElementById('searchButton');

  searchButton.addEventListener('click', search);

  // var searchResultsButton = document.getElementById('searchResults');

  // searchResultsButton.addEventListener('click', searchResults);



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
    searchTime = new Date().getTime();

    var termValue = document.getElementById('search').value;
    
    if(!termValue){      
        alert('No search terms entered');
      
      } else {

        var term = termValue.split(',');
      
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
    var filtered = {
      lastModified: (file) ? file.lastModified : 0,
      name: (file) ? file.name : 'text',
      term: term,
      matches: []
    };
    var searchType = document.querySelector('.check:checked').value;
    
    if(searchType === 'or'){
      parsed.forEach(function(x){
        
        term.forEach(function(y){
           if(x.toLowerCase().indexOf(y.toLowerCase()) !== -1){
            
              if(!checkArray(filtered.matches, x)){
                filtered.matches.push(x);
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

        if(allMatched && !checkArray(filtered.matches, t)){
             filtered.matches.push(t);
        }
      }); 
      
     
    }
    // resultsData();
    results.push(filtered);
    var end = (files) ? files.length : 1;
    
    if(results.length === end){
      console.log(results);
      addToTextArea();

    } else {
      addToTextAreaTemp(filtered);
    }
   
  }

  function resultsData(){
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
      
    }
    
  }

  function addToTextAreaTemp(obj){
    var textArea = document.getElementById('output');
    var outputString = textArea.value;
    
    obj.matches.forEach(function(item){      
        outputString += item + '\n';              
    });
    
    textArea.value = outputString;

  }


  function addToTextArea(){
    var textArea = document.getElementById('output');
    
    var outputString = '';
    var results_Sorted = results.sort(sortResults);

    results_Sorted.forEach(function(item){
      item.matches.forEach(function(match){
        outputString += match + '\n';  
      });

        
    });
    
    textArea.value = outputString;
    var end = new Date().getTime();
    var execution = end - searchTime;
    console.log(execution + 'ms');
    
  }

  function sortResults(a,b){
    return a.lastModified - b.lastModified;
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

})();

