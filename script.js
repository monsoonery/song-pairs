//var myObj = JSON.parse("/songlist.json");
//document.getElementById('songlisty').innerHTML = myObj[0].title;
//let songs = ['Dua Lipa', 'Banana', "Coolio", "DaBaby", "Diplo", "Briggs"];
//localStorage.setItem('pairlist', JSON.stringify(pairlist));
//document.getElementById("s1").oninput = handleInput; 
//document.getElementById("s2").oninput = handleInput; 
//autocomplete(document.getElementById("compatible"));
//autocomplete(document.getElementById("searchField"));
//console.log('pairlist local: ' + localStorage.getItem('pairlist'));
	
var songlist; 
var pairlist;													//json
//pairlist = JSON.parse(localStorage.getItem('pairlist'));	//[[x.y],[x,y], ...] trackid pairs
var richting = 1; 												//one-way or two-way compatible
var song1;
var song2;


function init() {
	//local json importers
	document.getElementById("jsonimport").addEventListener("change", loadJson);
	document.getElementById("jsonimport2").addEventListener("change", loadJson2);
	
	//song search functionality
	document.getElementById("searchField").oninput = handleInput; 

	//autocomplete for song 1 and song 2 box
	autocomplete(document.getElementById("s1"));
	autocomplete(document.getElementById("s2"));

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == document.getElementById('addNewSongModal')) {
		document.getElementById('addNewSongModal').style.display = "none";
		}
	}
	
	//resize search results box and pairs box
	window.onresize = function() {
		var sr = document.getElementById("searchResults");
		var cccc = document.getElementsByClassName('navbar')[0].getBoundingClientRect().height;
		var dddd = document.getElementById('searcher').getBoundingClientRect().height;
		var ssr = window.innerHeight - cccc - dddd - 500;
		sr.style.height = ssr + "px";
		
		var sc = document.getElementById("showcase");
		var eeee = document.getElementById('submitter').getBoundingClientRect().height;
		var ssc = window.innerHeight - cccc - eeee - 150;
		sc.style.height = ssc + "px";
		
		/*console.log("kek");
		console.log(cccc);
		console.log(ssr);*/
	};
	//show this tab when loading site
	goTo('collectionPage');
	
	console.log("init complete");
}


//-------------------------- server json import functions --------------------------
var requestSong = new XMLHttpRequest();
requestSong.open("GET", "https://monsoonery.github.io/song-pairs/songlist.json", true);
requestSong.send(null);	
requestSong.onreadystatechange = function() {
	if (this.readyState == 4) {
		if (requestSong.status === 200) {
			songlist = JSON.parse(requestSong.responseText);
			displaySongs(searchSongs(""));
			sendAlert("songlist.json loaded from server successfully!", "alert success");
		} else {
			sendAlert("Failed to load songlist.json (Error " + requestSong.status + ")", "alert");
		}
    }
}

var requestPair = new XMLHttpRequest();
requestPair.open("GET", "https://monsoonery.github.io/song-pairs/pairlist.json", true);
requestPair.send(null);	
requestPair.onreadystatechange = function() {
	if (this.readyState == 4) {
		if (requestPair.status === 200) {
			pairlist = JSON.parse(requestPair.responseText);
			sendAlert("pairlist.json loaded from server successfully!", "alert success");
		} else {
			sendAlert("Failed to load pairlist.json (Error " + requestPair.status + ")", "alert");
		}
    }
}

//-------------------------- END server json import functions --------------------------

//-------------------------- local json import functions --------------------------
function loadJson() {
	const file = this.files[0];
    let fr = new FileReader();
    fr.onload = function() {
        songlist = JSON.parse(fr.result);
		displaySongs(searchSongs(""));
		sendAlert("Local songlist.json loaded successfully!", "alert success");
		console.log(songlist);
	};
	console.log("songlist.json loaded");
	fr.readAsText(file);
}

function loadJson2() {
	const file = this.files[0];
    let fr = new FileReader();
    fr.onload = function() {
        pairlist = JSON.parse(fr.result);
		sendAlert("Local pairlist.json loaded successfully!", "alert success");
		console.log(pairlist);
	};
	console.log("pairlist.json loaded");
	fr.readAsText(file);
}
//-------------------------- END local json import functions --------------------------


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
			sendAlert("One or both songs entered do not exist in the song database", "alert warning");
			return;
		} else {
			//save new pair using track ids
			if (richting == 1) {
				//one-way compatible, write only once
				pairlist.push([id1, id2]);	
				writePair(song1, song2);
			} else if (richting == 2){
				//two-way compatible, write twice
				pairlist.push([id1, id2]);	
				writePair(song1, song2);
				pairlist.push([id2, id1]);	
				writePair(song2, song1);
			}
		}

		//confirmation for user
		sendAlert((song1 + " and " + song2 + " added!"), "alert success");
       
        //clear text input fields
        document.getElementById('s1').value = '';
        document.getElementById('s2').value = '';
              
    } else {
		//if a text field was left empty, warn the user
		sendAlert("One or both text fields are empty", "alert warning");
    }	
           
}

function writePair(x, y) {
	var i = pairlist.length - 1;
	//for reference
	console.log(i);
	console.log(pairlist[i]);
	//add track ids to recent additions
	/*var tempPar = document.createElement("p");
    var tempText = document.createTextNode(pairlist[i]);
    document.getElementById("showcase").appendChild(tempPar);
    tempPar.appendChild(tempText);*/
	//add song names to recent additions
	var par = document.createElement("p");
    var text = document.createTextNode(x + " + " + y);
    par.appendChild(text);
    document.getElementById("showcase").appendChild(par);
	localStorage.setItem('pairlist', JSON.stringify(pairlist));
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


//-------------------------- collection search functions -------------------------------	
function clearDiv(s) {
    document.getElementById(s).innerHTML = '';
}	
function handleInput(e) {
    displaySongs(searchSongs(e.target.value));
}
function searchSongs(text) {
	let songs = []; 
		for (j = 0; j < songlist.length; j++) {
		songs.push(songlist[j].artist + " - " + songlist[j].title);
	}
	
    return songs.filter(name => (" " + name.toLowerCase()).includes(" " + text.trim().toLowerCase()));
	console.log("bruhmius momentium");
}
function displaySongs(a) {
    clearDiv("searchResults");
	
	if (chosenSortMethod() == 0) { 						//track ID A-Z
		console.log("Sorting by artist A-Z");
		a.sort();
	} else if (1 == 1) {
		a.reverse(); 					//track ID Z-A
	} else if (chosenSortMethod() == 1) {					//artist A-Z
		
	} else if (1 == 1) {					//artist Z-A
		
	} else if (chosenSortMethod() == 2) {					//title A-Z
	
	} else if (1 == 1) {					//title Z-A
	
	}

    for (j = 0; j < a.length; j++) {
		var tempPar = document.createElement("p");
		let name = a[j];
		var tempText = document.createTextNode(a[j]);
		tempPar.onclick = function() {
			// find the object (song) in songlist with the requested artist and title
			var match = songlist.find(song => song.artist + " - " + song.title == name);
			// get the track ID belonging to that object
			var id = match.trackid;
			console.log(name);
			console.log(id);
			console.log(match);
			//show all songs in pairlist that work with this song
			showPairList(id);
		};
		tempPar.appendChild(tempText);
		searchResults.appendChild(tempPar);
	}
}
//-------------------------- END collection search functions -------------------------------

//-------------------------- compatible songs display functions -------------------------------	
var getArtistAndTitle = s => s.artist + " - " + s.title;
var findSong = id => songlist.find(s => s.trackid == id);
var getArtistAndTitleById = id => getArtistAndTitle(findSong(id));

function showPairList(x) {
	clearDiv("compatible");
	for (j = 0; j < pairlist.length; j++) {
		if (pairlist[j][0] == x) {
			var h = getArtistAndTitleById(pairlist[j][1]);
			var tempPar = document.createElement("p");
			var tempText = document.createTextNode(h);
			tempPar.appendChild(tempText);
			document.getElementById("compatible").appendChild(tempPar);
		}
	}
	document.getElementById('theFollowing').innerHTML = "The following songs are compatible with " + getArtistAndTitleById(x) + ": ";
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
		let name = results[i];
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function(e) {
            /*insert the value for the autocomplete text field:*/
            inp.value = name;
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
	var title = document.getElementById("modalTitle").value;
	var artist = document.getElementById("modalArtist").value;
	var bpm = document.getElementById("modalBPM").value;
	var camelot = document.getElementById("modalCamelot").value;
	var key = document.getElementById("modalKey").value;
	
	var id = songlist.length + 1;
	var tempObj = {"trackid": id,"title":title, "artist":artist, "bpm": bpm, "camelot":camelot, "key":key};
	console.log(tempObj);
	songlist.push(tempObj);
	console.log(songlist);
	
	sendAlert("Added " + artist + " - " + title + " to your song collection!", "alert success");
	
	document.getElementById('addNewSongModal').style.display = "none";
	
	document.getElementById("modalTitle").innerHTML = "";
	document.getElementById("modalArtist").innerHTML = "";
	document.getElementById("modalBPM").innerHTML = "";
	document.getElementById("modalCamelot").innerHTML = "";
	document.getElementById("modalKey").innerHTML = "";
}
//-------------------------- END modal box functions -------------------------------


//-------------------------- exporting/clearing json functions -------------------------------
function exportList(name, arr) {
	const filename = name;
	jsonStr = JSON.stringify(arr);
	
	let element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

function clearPairList() {
	if (confirm('Are you sure you want to clear the pairlist?')) {
		localStorage.setItem('pairlist', JSON.stringify([]));
		console.log('Pair list clearing complete.');
	} else {
		console.log('Pair list clearing cancelled.');
	}
}
//-------------------------- END exporting/clearing json functions -------------------------------

//-------------------------- switching pages functions -------------------------------
function goTo(p) {
	[].forEach.call(document.querySelectorAll("#pageContainer>div"), el => el.classList.add("hidden"));
	document.getElementById(p).classList.remove("hidden");
	[].forEach.call(document.querySelectorAll(".navbar>button"), el => el.classList.remove("active"));
	if (p == 'collectionPage') {
		document.getElementById('collectionBtn').classList.add("active");
		document.getElementById('pageContainer').style.backgroundColor = "#4CAF50";
	} else if (p == 'pairPage') {
		document.getElementById('pairBtn').classList.add("active");
		document.getElementById('pageContainer').style.backgroundColor = "#7B2A8D";
	} else if (p == 'settingsPage') {
		document.getElementById('settingsBtn').classList.add("active");
		document.getElementById('pageContainer').style.backgroundColor = "#34A5D5";
	}
	window.onresize();
}
//-------------------------- END switching pages functions -------------------------------

//-------------------------- sort by functions -------------------------------
var sortByVal;
function test () {
	console.log(document.getElementById('sortSearchResultsBySelect').selectedIndex);
	return document.getElementById('sortSearchResultsBySelect').selectedIndex;
	sortByVal = document.getElementById('sortSearchResultsBySelect').value;
	console.log(sortByVal);
}

function chosenSortMethod() {
	console.log(document.getElementById('sortSearchResultsBySelect').selectedIndex);
	return document.getElementById('sortSearchResultsBySelect').selectedIndex;
}
//-------------------------- END sort by functions -------------------------------

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function sendAlert(t, c) {
	//make notif box slowly fade in
	var div = document.createElement("div");
	div.className = c;
	setTimeout(function(){div.style.opacity = 1}, 0);
	
	var span = document.createElement("span");
	var cross = document.createTextNode("×");
	span.appendChild(cross);
	span.className = "closebtn";
	
	var p = document.createElement("p");
	var text = document.createTextNode(t);
	p.appendChild(text);
	div.appendChild(p);
	div.appendChild(span);
	document.getElementById('alertContainer').appendChild(div);
	
	//auto-dismiss after 3 seconds
	setTimeout(function(){ 
		div.style.opacity = "0";
		setTimeout(function(){ div.style.display = "none"; }, 300);		
		}, 3000);
	
	//dismiss when clicking on x
	span.onclick = function(){
		var div = this.parentElement;
		div.style.opacity = "0";
		setTimeout(function(){ div.style.display = "none"; }, 300);
	}
}


//sendAlert("cog", "alert success");
console.log("full js loaded");

