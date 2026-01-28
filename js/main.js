let API_URL = "https://nolar-eclipse.ca:8443"

let CAMPAIGN = localStorage.getItem("overseer-campaign")
let CHAPTER //do not set
let USER = localStorage.getItem("overseer-user")
let PASSWORD = localStorage.getItem("overseer-password")
let AUTHENTICATED = false

let FONTS = [
	{name: "Roboto", 			type: "sans-serif"},
	{name: "Nunito", 			type: "sans-serif"},
	{name: "Lora",				type: "serif"},
	{name: "PT Serif",			type: "serif"},
	{name: "Libre Baskerville", type: "serif"},
	{name: "EB Garamond", 		type: "serif"},
	{name: "Lobster", 			type: "sans-serif"},
	{name: "Satisfy", 			type: "cursive"},
	{name: "Caveat", 			type: "cursive"},
	{name: "Shadows Into Light",type: "cursive"},
	{name: "Indie Flower", 		type: "cursive"},
	{name: "Great Vibes", 		type: "cursive"},
	{name: "Cause", 			type: "cursive"},
	{name: "Fredoka", 			type: "sans-serif"},
	{name: "Google Sans Code", 	type: "monospace"},
	{name: "Kaushan Script", 	type: "cursive"},
	{name: "Allura", 			type: "cursive"},
	{name: "Comic Relief", 		type: "system-ui"}
]

let URL_PARAMS = {}
const params_arr_strings = window.location.href.split('?')[1]?.split('&');
if (params_arr_strings)
	for (let i = 0; i < params_arr_strings.length; i++) {
	   let pair = params_arr_strings[i].split('=');
	   URL_PARAMS[pair[0]] = pair[1]
	}

if(URL_PARAMS.guild){
	let fetchUrl = `${API_URL}/clusterOutput/campaign/guild/${URL_PARAMS.guild}`
	const response = fetch(fetchUrl, {
	  	method: "GET"
	}).then(res => {
		res.json().then(data =>{
			if (data.dc_guild_id){
				localStorage.setItem("overseer-campaign", data)
				CAMPAIGN = data
				refreshCampaign()
			}
		})
	})
}






// FUNCTIONS ================>
function classicify(text, bg){
	let col1 = text ?? "black"
	let col2 = bg ?? "white"
	document.documentElement.style.setProperty('--dark-tone', col1);
	document.documentElement.style.setProperty('--darker-tone', col2);
	document.documentElement.style.setProperty('--middle-tone', col2);
	document.documentElement.style.setProperty('--light-tone', col2);
	document.documentElement.style.setProperty('--shadow-tone', col2);
	document.getElementById("aside").classList.remove("hoverable")
	let css = `<style id="classic-style">
	    :root {
	    	--aside-width: 30vw !important;
	    	--reading-zone-width: 95vw !important;
	    }
		body{
			background-color: ${col2} !important;
		}
		* {
			font-family: "EB Garamond", serif;
			article *{
				color: ${col1} !important;
				background-color: ${col2} !important;
				border: ${col2} solid 0px !important;
				box-shadow: ${col2} 0 0 0 !important;
			}
			#reading-zone{
				border: ${col2} solid 0px;!
			}
			.message{
				.message-header{
					.message-profile-picture{
						display:none
					}
				}
				.message-text{
					margin: 0;
					padding: 0;
				}
			}
	  	#aside-button{
	  			background-color: ${col2};
	  			padding: 0.6em 0.8em;
	  			border-radius: var(--border-rad);
			  	border: ${col1} solid 2px;
		  		align-self: flex-start;
		  		margin: 0.3em 0.4em;

		  		p{
		  			color: ${col1};
		  		}
			}
			#aside-edit-button.editing, .button.selected{
				background-color: var(--light-tone) !important;
				box-shadow: var(--shadow-tone) inset 0px 0px 0px !important;
				border: var(--dark-tone) dashed 2px !important;
				color: var(--dark-tone) !important;
			}
			.cit{
				*{
					color: var(--dark-tone) !important;
				}
				.cit-lining{
					background-color: var(--dark-tone) !important;
				}
			}
			.thread{
				.thread-box{
					width: 93%;
				}
			}
			*::-moz-selection, *::selection{
				color:var(--light-tone);
				background: var(--dark-tone);
			}
		}
		@media screen and (max-width: 600px) {
		  	:root {
		  		--aside-width: 50vw important!;
		  		--reading-zone-width: 95vw important!;
		    }
	    }
	</style>`
	document.body.innerHTML += css
}
function markdown(node){
	if (!node) return
	if (!node.parentElement){
		return searchAndReplaces(marked.parse(node))
		//return marked.parse(searchAndReplaces(node))
	}else{
		node.innerHTML = searchAndReplaces(marked.parse(node.innerHTML))
	}
}
function searchAndReplaces(text){
	return text
		.replace(/<script.*>.*<\/script>/g, "") //remove scripts

		//citations (> )
		.replace(/(\r\n|\r|\n|>)(&gt;|>) /g, "<div class='cit'><div class='cit-lining'></div><p>")
		.replace(/(\r\n|\r|\n|>)(&gt;|>) .*(\r\n|\r|\n)/g, "</p></div>")

		//comments (-#)
		.replace(/(\r\n|\r|\n|>)-# /g, "<span class='comment'>")
		.replace(/(\r\n|\r|\n|>)-# .*(\r\n|\r|\n)/g, "</span>")

		//code blocks (```), do nothing
		.replace(/```/g, "")
}
function indent(node){
	if (!node) return
	let output = ""
	if (!node.parentElement){
		const paragraphs = node.split(/(\r\n|\r|\n)/)
		for (const paragraph of paragraphs){
			output += `<div class="paragraph">${paragraph}</div>`
		}
		return output
	}else{
		const paragraphs = node.innerHTML.split(/(\r\n|\r|\n)/)
		for (const paragraph of paragraphs){
			output += `<div class="paragraph">${paragraph}</div>`
		}
		node.innerHTML = output
	}
	
}
function readify(node){
	if (!node) return
	node = markdown(node)
	node = indent(node)
	return node
}
function sanitize(str) {
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&apos;')
              .replace(/\\/g, '&bsol;')
              //.replace(/ /g, '&nbsp;');
}
async function authenticate (discordUserId, password){
	let fetchUrl = `${API_URL}/users/CheckCreds?discordId=${discordUserId}&passwordClear=${password}`
	const response = await fetch(fetchUrl, {
	  	method: "GET"
	});
	let data = await response.json()
	if (typeof data.response !== "boolean"){
		return false
	}
	return data
}

function setElementFont(element, font){
	element.style.fontFamily = `${font.name}, ${font.type}`
}

function selectElementsFromId(id){
	let selectables = document.getElementsByClassName(`selectable-${id}`)

	let selectState = !selectables[0].classList.contains("selected")

	for (let i = 0; i < selectables.length; i++){
		if (selectState){
			selectables[i].classList.add("selected")
		}else{
			selectables[i].classList.remove("selected")
		}
	}
}

function toggleEditMode(scope){
	let editables = document.getElementsByClassName(`editable-${scope}`)
	let editState = !editables[0].classList.contains("editing")

	for (let i = 0; i < editables.length; i++){
		if (editState){
			editables[i].classList.add("editing")
		}else{
			editables[i].classList.remove("editing")
		}
	}
}

function addChapterGroupToUI(chapterGroup){
	let element = document.createElement("div")
	element.classList.add("chapter-group")

	element.innerHTML = 
	`
	<div class="chapter-group-header" onclick="selectElementsFromId('${chapterGroup.id}')">
		<p class="chapter-group-title" >${sanitize(chapterGroup.name)}</p>
		<p class="chapter-group-arrow selectable-${chapterGroup.id}">➤</p>
	</div>
	<div id="chapter-container-${chapterGroup.id}" class="chapter-container selectable-${chapterGroup.id}">
	</div>
	`

	document.getElementById("aside-chapter-group-container").appendChild(element)
}

function addChapterToUI(chapter, chapterGroupId){
	let chapterContainer = document.getElementById(`chapter-container-${chapterGroupId}`)
	let element = document.createElement("div")
	element.classList.add("chapter")

	element.innerHTML = `<p id="${chapter.id}" class="chapter-title" onclick="selectChapter(${chapter.id})">${chapter.name}</p>`

	chapterContainer.appendChild(element)
}

function getChapterFromId(chapterId){
	for (let i = 0; i < CAMPAIGN.chapter_groups.length; i++){
		let chapterGroup = CAMPAIGN.chapter_groups[i]
		for (let j = 0; j < chapterGroup.chapters.length; j++){
			if (chapterGroup.chapters[j].id === chapterId) return chapterGroup.chapters[j]
		}
	}
}

function selectChapter(id){
	CHAPTER = getChapterFromId(id)

	if (!CHAPTER){console.log("No chapter with id "+id); return}
	refreshChapter()
}

function addThread(thread){
	let readingZone = document.getElementById("reading-zone")
	let threadHTML = `
		<div class="thread" id="thread-${thread.id}">
			<p class="thread-header">* * * ${sanitize(thread.name)} * * *</p>
			<div class="thread-box" id="thread-box-${thread.id}"> </div>
			<p class="thread-footer"> * * *</p>
		</div>
	`
	readingZone.innerHTML += threadHTML
}

let lastMessageAdded = {speaker:{name:""},thread:{id:-1}}

async function getMessageText(id){
		let fetchUrl = `${API_URL}/clusterOutput/message/id/${id}`
		const response = await fetch(fetchUrl, {
		  	method: "GET"
		});
		let data = await response.json()
		return data.message
}

function addMessage(message, i){
	if (!message.message){
		message.message = message.id
	}

	let pfp = message.speaker.profile_picture ?? "./media/pfps/unknown.png"
	let readingZone = document.getElementById("reading-zone")

	if (message.thread.id !== 0){
		let threadElement = document.getElementById("thread-box-"+message.thread.id)
		if (!threadElement) {
			addThread(message.thread)
			threadElement = document.getElementById("thread-box-"+message.thread.id)
			if (!threadElement){
				return
			}
		}
		readingZone = threadElement
	}


	let messageHTML = `
	<div class="message" id="message-${message.id}">
		<div class="message-header">
			<img src="${pfp}" alt="profile picture" class="message-profile-picture">
			<p class="message-author">${sanitize(message.speaker.name)}</p>
		</div>
		<div class="message-text" lang="en" id="message-text-${message.id}">${message.message}</div>
	</div>
	`

	if (lastMessageAdded.speaker.name === message.speaker.name && message.thread.id === lastMessageAdded.thread.id){
		lastMessageAdded.message += "<br><br>"+message.message
		document.getElementById(`message-text-${lastMessageAdded.id}`).innerHTML = `${lastMessageAdded.message}`
	}else{
		readingZone.innerHTML+=messageHTML
		lastMessageAdded = message
	}
	document.getElementById(`message-text-${lastMessageAdded.id}`)
	let loadThisMessageWhenInView = async () => {
		const element = document.getElementById(`message-text-${message.id}`);
	  //console.log("pre elem check")
	  if (!element?.parentElement) return
	  const position = element.getBoundingClientRect();

		//console.log("pre if")
	  if(position.top < window.innerHeight && position.bottom >= 0) {
	    if (!element.innerHTML.match(/^[0-9]+(<br><br>[0-9]+)*$/g)) {
	    	return
	    }
	    let ids = element.innerHTML.split(/<br><br>/g)
	    element.innerHTML=""
	    for (const id of ids){
	    	let text = await getMessageText(id)
	    	element.innerHTML += text+"<br><br>"
	    }
	    element.innerHTML = element.innerHTML.substring(0,element.innerHTML.length-8)
	    element.innerHTML = readify(element.innerHTML)
	  }
	}
	window.addEventListener('scroll', loadThisMessageWhenInView);
}


async function refreshChapter(){
	if (!CHAPTER) return
	let chapterTitles = document.getElementsByClassName("chapter-name")
	for(let i = 0; i < chapterTitles.length; i++){
		chapterTitles[i].innerHTML = CHAPTER.name
	}

	let readingZone = document.getElementById("reading-zone")
	readingZone.innerHTML = ""

	if (CHAPTER.messages === "unloaded"){
		let fetchUrl = `${API_URL}/clusterOutput/chapter/${CHAPTER.id}`
		const response = await fetch(fetchUrl, {
		  	method: "GET"
		});
		let data = await response.json()
		CHAPTER.messages = data.messages

	}
	//make sure to load messages individualy
	for (const m of CHAPTER.messages){
		m.message = undefined
	}

	for (let i = 0; i < CHAPTER.messages.length; i++){
		addMessage(CHAPTER.messages[i], i)
		removeDupMessages(CHAPTER.messages[i].id)
	}
	window.dispatchEvent(new CustomEvent('scroll'))
}
function removeDupMessages(id){
	let messages = document.getElementById("message-"+id)

	if (messages)
	for (let i = 1; i < messages.length; i++){
		messages[i].remove()
	}
}

function toggleSelected(elem){
	if (!elem || !elem.parentElement) return
	if (!elem.classList.contains("selected")){
		elem.classList.add("selected")
	}else{
		elem.classList.remove("selected")
	}
}

async function refreshCampaign(){
	if (!CAMPAIGN || !CAMPAIGN.id) return

	//set campaign name everywhere it needs to be
	document.title = `${sanitize(CAMPAIGN.name)} - (Overseer)`
	let campaignTitles = document.getElementsByClassName("campaign-name")
	for(let i = 0; i < campaignTitles.length; i++){
		campaignTitles[i].innerHTML = sanitize(CAMPAIGN.name)
	}



	//load chapter groups
	document.getElementById("aside-chapter-group-container").innerHTML = ""
	for (let i = 0; i < CAMPAIGN.chapter_groups.length; i++){
		addChapterGroupToUI(CAMPAIGN.chapter_groups[i])

		//load chapters
		for (let j = 0; j < CAMPAIGN.chapter_groups[i].chapters.length; j++){
			addChapterToUI(CAMPAIGN.chapter_groups[i].chapters[j], CAMPAIGN.chapter_groups[i].id)
		}
	}

	CHAPTER = CAMPAIGN.chapter_groups[0].chapters[0]
	refreshChapter()
}
let WIDTH_CURSOR_HELD = false
let WIDTH_CURSOR_ELEM = document.getElementById("reading-zone-resize-cursor")
let WIDTH_CONTAINER = document.getElementById("reading-zone-resize-container")
let MOUSEX = 0
function handleHold() {
	if (window.innerWidth < 600) return
  if (WIDTH_CURSOR_HELD){
  	const cursorRect = WIDTH_CURSOR_ELEM.getBoundingClientRect();
	  const containerRect = WIDTH_CONTAINER.getBoundingClientRect();

	  const leftEdge = (containerRect.right - containerRect.left) / 2 + containerRect.left;
	  const rightEdge = containerRect.right;

	  let newXPos = Math.min(Math.max(MOUSEX, leftEdge), rightEdge);

	  const relativeX = newXPos - containerRect.left;

	  WIDTH_CURSOR_ELEM.style.left = relativeX + "px";

	  document.documentElement.style.setProperty('--reading-zone-diff', ((rightEdge - relativeX)*2) + "px");
  }

  setTimeout(handleHold, 10);
}
document.addEventListener("DOMContentLoaded", () => {
  WIDTH_CURSOR_ELEM = document.getElementById("reading-zone-resize-cursor");
  WIDTH_CONTAINER = document.getElementById("reading-zone-resize-container");

  console.log("connected:", WIDTH_CONTAINER.isConnected); // should be true

  WIDTH_CONTAINER.addEventListener("mousedown", () => WIDTH_CURSOR_HELD = true);
  window.addEventListener("mouseup", () => WIDTH_CURSOR_HELD = false);

  document.addEventListener("mousemove", e => {
    MOUSEX = e.clientX;
  });

  requestAnimationFrame(handleHold);
});


handleHold()

//events and custom elements




//LOGIC =================>
//load test values
//CAMPAIGN = TEST_VALUES[0]
if (URL_PARAMS["mode"]){
	if (URL_PARAMS["mode"] === "book") classicify("#242424FF", "#FAEEE1FF")
	else if (URL_PARAMS["mode"] === "book-dark") classicify("#FAEEE1FF", "#242424FF")
}

if (USER && PASSWORD) AUTHENTICATED = authenticate(USER.dc_user_id, PASSWORD) //async

//set accurate page title if needed.
if (CAMPAIGN){
	refreshCampaign()
}
else document.title = `Overseer`

