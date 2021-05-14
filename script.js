//var myObj = JSON.parse("/songlist.json");
//document.getElementById('songlisty').innerHTML = myObj[0].title;
//let songs = ['Dua Lipa', 'Banana', "Coolio", "DaBaby", "Diplo", "Briggs"];
//var i = 0;
//let songs = []; 		//artist + title, for search results
//var countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

var songlist; 													//json
let pairs = JSON.parse(localStorage.getItem('pairList'));		//[[x.y],[x,y], ...] trackid pairs
var richting = 1; 												//one-way or two-way compatible
//localStorage.setItem('pairList', JSON.stringify(pairs));
var song1;
var song2;


function init() {
	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == document.getElementById('addNewSongModal')) {
		document.getElementById('addNewSongModal').style.display = "none";
		}
	}
	document.getElementById("jsonimport").addEventListener("change", loadJson);
	document.getElementById("searchField").oninput = handleInput; 
	//document.getElementById("s1").oninput = handleInput; 
	//document.getElementById("s2").oninput = handleInput; 
	autocomplete(document.getElementById("s1"));
	autocomplete(document.getElementById("s2"));
	//autocomplete(document.getElementById("compatible"));
	//autocomplete(document.getElementById("searchField"));
	console.log("init complete");
}

//-------------------------- json import functions --------------------------
function loadJson() {
	const file = this.files[0];
    let fr = new FileReader();
    fr.onload = function() {
        songlist = JSON.parse(fr.result);
		document.getElementById('notifier').innerHTML = "JSON loaded successfully!";
		//loadSongsInArray();
		
	};
	console.log("json loaded");
	fr.readAsText(file);
}
/*function loadSongsInArray() {
	for (j = 0; j < songlist.length; j++) {
		songList.push(songlist[j].title);
	}
}*/
//-------------------------- END json import functions --------------------------


//-------------------------- new pair entries functions --------------------------
function submitSongs() {
	//grab input
	song1 = document.getElementById('s1').value;
	song2 = document.getElementById('s2').value;
    if (song1 != '' && song2 != '') {
	
		var id1;
		var id2;
		var found1 = false;
		var found2 = false;
		
		//find song title that matches input, then store its track id
		for (j = 0; j < songlist.length; j++) {
			if (song1 == songlist[j].artist + " - " + songlist[j].title) {
				id1 = songlist[j].trackid;
				found1 = true;
				break;
			}
		}
		for (j = 0; j < songlist.length; j++) {
			if (song2 == songlist[j].artist + " - " + songlist[j].title) {
				id2 = songlist[j].trackid;
				found2 = true;
				break;
			} 
		}
		
		if (!found1 || !found2) {
			//if one of the two songs wasn't found, warn the user
			alert("not found");
			return;
		} else {
			//save new pair using track ids
			if (richting == 1) {
				//one-way compatible, write only once
				pairs.push([id1, id2]);	
				writePair(song1, song2);
			} else if (richting == 2){
				//two-way compatible, write twice
				pairs.push([id1, id2]);	
				writePair(song1, song2);
				pairs.push([id2, id1]);	
				writePair(song2, song1);
			}
		}

		//confirmation for user
		alert(song1 + " and " + song2 + " added!");
       
        //clear text input fields
        document.getElementById('s1').value = '';
        document.getElementById('s2').value = '';
              
    } else {
		//if a text field was left empty, warn the user
        alert("wrong input");
    }	
           
}

function writePair(x, y) {
	var i = pairs.length - 1;
	//for reference
	console.log(i);
	console.log(pairs[i]);
	//add track ids to recent additions
	var tempPar = document.createElement("p");
    var tempText = document.createTextNode(pairs[i]);
    document.getElementById("showcase").appendChild(tempPar);
    tempPar.appendChild(tempText);
	//add song names to recent additions
	var par = document.createElement("p");
    var text = document.createTextNode(x + " + " + y);
    par.appendChild(text);
    document.getElementById("showcase").appendChild(par);
	localStorage.setItem('pairList', JSON.stringify(pairs));
}
        
function cycleButtonIcon() {
    if (richting == 1) {
		//set to two-way
        document.getElementById("way").innerText = "<-->";
        richting = 2;
    } else if (richting == 2) {
		//set to one-way
        document.getElementById("way").innerText = "--->";
        richting = 1;
    }
}	
//-------------------------- END new pair entries functions --------------------------


//-------------------------- paragraph search functions -------------------------------	
function clearDiv(s) {
    document.getElementById(s).innerHTML = '';
}	
function handleInput(e) {
    displaySongs(searchSongs(e.target.value));
}
function searchSongs(text) {
	let songs = []; 
	//songs.length = 0;
	for (j = 0; j < songlist.length; j++) {
		songs.push(songlist[j].artist + " - " + songlist[j].title);
	}
    return songs.filter(name => (" " + name.toLowerCase()).includes(" " + text.trim().toLowerCase()));
	console.log("bruhmius momentium");
}
function displaySongs(a) {
    clearDiv("searchResults");

    for (j = 0; j < a.length; j++) {
		var tempPar = document.createElement("p");
		let name = a[j];
		var tempText = document.createTextNode(a[j]);
		tempPar.onclick = function() {
			var match = songlist.find(song => song.artist + " - " + song.title == name);
			var id = match.trackid;
			console.log(name);
			console.log(id);
			console.log(match);
			showPairList(id);
		};
		tempPar.appendChild(tempText);
		searchResults.appendChild(tempPar);
	}
}
//-------------------------- END paragraph search functions -------------------------------

//-------------------------- compatible songs display functions -------------------------------	
var getArtistAndTitle = s => s.artist + " - " + s.title;
var findSong = id => songlist.find(s => s.trackid == id);
var getArtistAndTitleById = id => getArtistAndTitle(findSong(id));

function showPairList(x) {
	clearDiv("compatible");
	for (j = 0; j < pairs.length; j++) {
		if (pairs[j][0] == x) {
			var h = getArtistAndTitleById(pairs[j][1]);
			var tempPar = document.createElement("p");
			var tempText = document.createTextNode(h);
			tempPar.appendChild(tempText);
			document.getElementById("compatible").appendChild(tempPar);
		}
	}
	document.getElementById('theFollowing').innerHTML = "The following songs are compatible with " + getArtistAndTitleById(x);
}

//-------------------------- END compatible songs display functions -------------------------------	



//-------------------------- yoinked autocomplete functions -------------------------------
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments, 
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
	  /*run a search and store matching values in array called results*/
	  results = searchSongs(val);
      /*for each item in the array...*/
      for (i = 0; i < results.length; i++) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
		let index = (" " + results[i]).toLowerCase().indexOf(" " + (val.trim().toLowerCase()));
		let len = val.trim().length;
		b.innerHTML = results[i].substr(0, index);
		b.innerHTML += "<strong>" + results[i].substr(index, len) + "</strong>";
		b.innerHTML += results[i].substr(index + len);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + results[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function(e) {
            /*insert the value for the autocomplete text field:*/
            inp.value = this.getElementsByTagName("input")[0].value;
            /*close the list of autocompleted values,
            (or any other open lists of autocompleted values:*/
            closeAllLists();
        });
        a.appendChild(b);
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}
//-------------------------- END yoinked autocomplete functions -------------------------------

//-------------------------- clear pairs list functions -------------------------------
function clearPairList() {
	if (confirm('Are you sure you want to clear the pairs list?')) {
		localStorage.setItem('pairList', JSON.stringify([]));
		console.log('Pair list clearing complete.');
	} else {
		console.log('Pair list clearing cancelled.');
	}
}
//-------------------------- END clear pairs list functions -------------------------------

//-------------------------- modal box functions -------------------------------
function openNewSongPopup() {
	document.getElementById('addNewSongModal').style.display = "block";
}
	// When the user clicks on <span> (x), close the modal
function closeNewSongPopup() {
	document.getElementById('addNewSongModal').style.display = "none";
}
function saveNewSong() {
	console.log("nice");
}

//-------------------------- END modal box functions -------------------------------


console.log("full js loaded");

