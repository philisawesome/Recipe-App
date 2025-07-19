export interface Option {
	value: string,
	label: string,
}

export const LabelToOptions: {[Key: string]: Option[]} = {
	"meal": [
		{ value: "breakfast", label: "Breakfast" },
		{ value: "lunch", label: "Lunch" },
		{ value: "dinner", label: "Dinner" },
		{ value: "dessert", label: "Dessert" },
	],
	"price": [
		{ value: "$", label: "$" },
		{ value: "$$", label: "$$" },
		{ value: "$$$", label: "$$$" },
	],
	"cuisine": [
    	{ value: "african", label: "African" },
    	{ value: "asian", label: "Asian" },
    	{ value: "american", label: "American" },
    	{ value: "british", label: "British" },
    	{ value: "cajun", label: "Cajun" },
    	{ value: "caribbean", label: "Caribbean" },
    	{ value: "chinese", label: "Chinese" },
    	{ value: "easternEuropean", label: "Eastern European" },
    	{ value: "european", label: "European" },
    	{ value: "french", label: "French" },
    	{ value: "german", label: "German" },
    	{ value: "greek", label: "Greek" },
    	{ value: "indian", label: "Indian" },
    	{ value: "irish", label: "Irish" },
    	{ value: "italian", label: "Italian" },
    	{ value: "japanese", label: "Japanese" },
    	{ value: "jewish", label: "Jewish" },
    	{ value: "korean", label: "Korean" },
    	{ value: "latinAmerican", label: "Latin American" },
    	{ value: "mediterranean", label: "Mediterranean" },
    	{ value: "mexican", label: "Mexican" },
    	{ value: "middleEastern", label: "Middle Eastern" },
    	{ value: "nordic", label: "Nordic" },
    	{ value: "southern", label: "Southern" },
    	{ value: "spanish", label: "Spanish" },
    	{ value: "thai", label: "Thai" },
    	{ value: "vietnamese", label: "Vietnamese" },
	]
}

export const TogglableOptions = [
	{ value: "vegan", label: "Vegan" },
	{ value: "onePan", label: "One-pan" },
	{ value: "highProtein", label: "High protein" },
	{ value: "noCook", label: "No-cook" },
	{ value: "kidFriendly", label: "Kid-friendly" },
]

export interface FilterState {
	maxTime: number[],
	toggled: {
		[index: string]: boolean;
	},
	dropdowns: {
		[index: string]: string;
	},
}

export function DefaultFilter(): FilterState {	
	let noFilters: FilterState = {
		maxTime: [0],
		toggled: { },
		dropdowns: { },
	}
	TogglableOptions.forEach((o) => {
		noFilters.toggled[o.value] = false
	})
	for (const k in Object.keys(LabelToOptions)) {
		noFilters.dropdowns[k] = ""
	}
	return noFilters
}
