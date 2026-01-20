let API_URL = "http://107.152.41.172:8889"

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
const params_arr_strings = window.location.href.split('?')[1].split('&');
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
			console.log(data)
			if (data.dc_guild_id){
				localStorage.setItem("overseer-campaign", data)
				CAMPAIGN = data
				refreshCampaign()
			}
		})
	})
}






// FUNCTIONS ================>
function sanitize(str) {
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&apos;')
              .replace(/\\/g, '&bsol;')
              .replace(/ /g, '&nbsp;');
}
async function authenticate (discordUserId, password){
	let fetchUrl = `${API_URL}/users/CheckCreds?discordId=${discordUserId}&passwordClear=${password}`
	const response = await fetch(fetchUrl, {
	  	method: "GET"
	});
	let data = await response.json()
	if (typeof data.response !== "boolean"){
		console.log(data.response)
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

function addMessage(message){
	let pfp = message.speaker.profile_picture ?? "./media/pfps/unknown.png"
	let readingZone = document.getElementById("reading-zone")

	if (message.thread.id !== 0){
		let threadElement = document.getElementById("thread-box-"+message.thread.id)
		if (!threadElement) {
			addThread(message.thread)
			threadElement = document.getElementById("thread-box-"+message.thread.id)
			if (!threadElement){
				console.log("error while creating thread:")
				console.log(message.thread)
				return
			}
		}
		readingZone = threadElement
	}



	let messageHTML = `
	<div class="message">
		<div class="message-header">
			<img src="${pfp}" alt="profile picture" class="message-profile-picture">
			<p class="message-author">${sanitize(message.speaker.name)}</p>
		</div>
		<p class="message-text">${sanitize(message.message)}</p>
	</div>
	`
	readingZone.innerHTML+=messageHTML
}

async function refreshChapter(){
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

	for (let i = 0; i < CHAPTER.messages.length; i++){
		addMessage(CHAPTER.messages[i])
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





//LOGIC =================>
//load test values
//CAMPAIGN = TEST_VALUES[0]


if (USER && PASSWORD) AUTHENTICATED = authenticate(USER.dc_user_id, PASSWORD) //async

//set accurate page title if needed.
if (CAMPAIGN){
	refreshCampaign()
}
else document.title = `Overseer`

