const TEST_VALUES = [
	//campaign
	{
		name : "Valmora",
		uid : "052e3aaf-ca11-4bac-b9be-98d1461b69ee",
		owners: [
			{
				dc_user_id : "300012833016512514",
				dc_username: "Nola",
				password_hash: "some_password_hash"
			},
			{
				dc_user_id : "1290040130622591038",
				dc_username: "sy",
				password_hash: "some_password_hash"
			},
		],
		chapter_groups : [
			{
				id: 1,
				name:"Story",
				chapters: [
					{
						id: 1,
						uid: "969e6c8f-d72d-4ca9-9c9a-7e9c6fa4c283",
						name: "Prologue",
						isCanon: true,
						messages: [
							{
								id:1,
								message:`After the prince’s speech, a weight settles on your eyelids, beckoning them closed. The light beating down on you from the chandeliers lining the ceilings feels hot on your skin, far from the inviting warmth you had imagined. A scent lingers as you drift back to sleep… sage, lilies, and something else. \n\nThree knocks on hard wood startle you awake. Your body stings in shock from the sensation of the mattress beneath you, quilted, featherlight, and soft. Mindnumbingly soft. You are a millimeter from falling into slumber once more, when you hear the door swing open. Followed by footsteps. \n\n“Prisoner,” the voice calls. “It’s time.”`,
								chapter:"1",
								speaker:{
									id: 1,
									name: "Oracle",
									boon: "None.",
									bio: "None.",
									player: 1
								},
								date_sent:"9/30/25",
								thread: {
									id:0,
									name:"main"
								},
							},
							{
								id:2,
								message:`*Arya, Éponine, and Guinevere must roll for perception.*`,
								chapter:"1",
								speaker:{
									id: 2,
									name: "Fate",
									boon: "None.",
									bio: "None.",
									player: 1
								},
								date_sent:"9/30/25",
								thread: {
									id:0,
									name:"main"
								},
							},
						]
					},
					{
						id: 2,
						uid: "969e6c8f-d72d-4ca9-9c9a-7e9c6fa4c283",
						name: "Chapter 1",
						isCanon: true,
						messages: "unloaded"
					},
					{
						id: 3,
						uid: "969e6c8f-d72d-4ca9-9c9a-7e9c6fa4c283",
						name: "Chapter 2",
						isCanon: true,
						messages: "unloaded"
					},
					{
						id: 4,
						uid: "969e6c8f-d72d-4ca9-9c9a-7e9c6fa4c283",
						name: "Chapter 3",
						isCanon: true,
						messages: "unloaded"
					},
					{
						id: 5,
						uid: "969e6c8f-d72d-4ca9-9c9a-7e9c6fa4c283",
						name: "Chapter 4",
						isCanon: true,
						messages: "unloaded"
					},
				]
			},
			{
				id: 2,
				name:"Lore & info",
				chapters: [
					{
						uid: "1bc69f64-fd18-4683-8334-b5b77ecf46fd",
						name: "Prologue",
						isCanon: false,
						messages: "unloaded"
					},
				]
			},
		]
	}
]