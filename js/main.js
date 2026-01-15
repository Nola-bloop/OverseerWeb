let API_URL = "http://107.152.41.172:8889"

let CAMPAIGN = localStorage.getItem("overseer-campaign")
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






// FUNCTIONS ================>
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

function addChapterGroupToUI(name, chapters){

}





//LOGIC =================>
if (USER && PASSWORD) AUTHENTICATED = authenticate(USER.dc_user_id, PASSWORD) //async

//set accurate page title if needed.
if (CAMPAIGN)
	document.title = `${CAMPAIGN.name} - (Overseer)`
else
	document.title = `Overseer`

