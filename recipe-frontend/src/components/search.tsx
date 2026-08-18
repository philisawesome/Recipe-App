/*
backlog todo:
- filters
- skeleton/loading screen while loading
*/

import { useState, useEffect, useRef } from "react"
import { api, redirect, } from "./auth-store";
import { API_URL, getURLParams } from "./utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"
import { Input } from "./ui/input"
import { DefaultFilter } from "./ui/filter-consts"
import { type FilterState, FilterCard } from "./ui/filter-card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs"
import { PostsFeed } from "./post-feed"
import type PostThumbnail from "./post-thumbnail"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "./ui/field"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "./ui/toggle-group"

const SEARCH_SUGGESTION_LIMIT = 5

type Result = {
	title: string
	description: string
	link: string
	thumbnail?: PostThumbnail
	avatar?: string
}

export function SearchPage() {
	const [query, setQuery] = useState("")
	const [option, setOption] = useState(null)
	const [placeholder, setPlaceholder] = useState("")

	useEffect(() => {
		setQuery(getURLParams().q|| "")
		setOption(getURLParams().o)
		setPlaceholder(randVegetable())
	})

	function randVegetable() {
		const v = ['cucumbers', 'tomatoes', 'potatoes', 'red onion', 'garlic', 'yellow squash']
		return v[Math.floor(Math.random() * v.length)];
	}

	return <>
		<h1 className="mb-4">Search{query ? ` for '${query}'` : ''}</h1>
		<SearchWithAutocomplete 
			className="w-full flex flex-col items-center justify-items-center"
			type={option}
			query={query}
			placeholder={placeholder}
			/>
	</>
}

export function SearchWithAutocomplete(props: {
	type?: string
	noFilter?: boolean,
	showSuggestions?: boolean,
	placeholder?: string,
	collapsible?: boolean,
	query?: string,
	className?: string,
}) {
	const {
		type, className, showSuggestions, noFilter, 
		query: initialQuery, placeholder, collapsible} = props
	const [query, setQuery] = useState(initialQuery||"");
	const [results, setResults] = useState<Result[]>([]); // suggestions and results
	const [filterState, setFilterState] = useState(DefaultFilter())
	const [searching, setSearching] = useState<boolean>(initialQuery==null);
	const [searchOption, setSearchOption] = useState(type)

	useEffect(() => {
		setSearchOption(type)
		if (initialQuery) {
			getSearchResults(type, initialQuery)
			setSearching(false)
		}
	}, [initialQuery, type])

	const handleChange = (e) => {
		setSearching(true)
		const value = e.target.value;
		setQuery(value);

		if (!value) {
			setResults([])
			return
		};
		
		getSearchResults(searchOption, value, SEARCH_SUGGESTION_LIMIT)
	}

	const getSearchResults = (searchOption: string, value: string, limit: number = 0) => {
		if (searchOption === "Recipes") {
			api.get(`${API_URL}/searchPost?q=${value}${limit>0?`&limit=${limit}`:''}`)
			.then((res) => {
				setResults(res.data.posts.map(({
					title, content, _id, images, likes
				}) => (
					{
						title: title, 
						description: content,
						link: `post?id=${_id}`,
						thumbnail: {
							postId: _id,
							imageUrl: images[0] ?? '',
							author: '', // todo backend send author
							avatar:  '', // todo
							title: title,
							summary: content,
							likes: likes.length,
						}
					}
				)))
			})
		} else if (searchOption === "Users") {
			api.get(`${API_URL}/search?q=${value}${limit>0?`&limit=${limit}`:''}`)
			.then((res) => {
				console.log(res.data.users)
				setResults(res.data.users.map(({name, username, _id, avatar}) => (
					{
						title: `${name?name:''} @${username}`,
						description: '',
						link: `profile?user=${username}`,
						avatar: avatar,
					}
				)))
			})
		}
	};

	const onEnter = (e) => {
		if (query) {
			redirect.set(`search?o=${searchOption}&q=${query}`)
		}
	}

	return <div className={className}>
		<div className="flex items-center justify-center">
			{!noFilter && <ToggleGroupSelector
				selected={searchOption}
				setSelected={(o) => {
					setSearchOption(o)
					setSearching(true)
					setResults([])
				}}
				options={["Recipes", "Users"]}
				/>}

			<Searchbar
				collapsible={collapsible}
				value={query}
				onChange={handleChange}
				noFilter={noFilter}
				filterState={filterState}
				setFilterState={setFilterState}
				results={results}
				setResults={setResults}
				showSuggestions={showSuggestions}
				placeholder={placeholder}
				onEnter={onEnter}
				/>
		</div>

		{!showSuggestions && <div className="w-full md:w-2xl mt-5 flex flex-col items-center">
			{searching && (
				query ?
					<div className="w-fit flex flex-col">
						{results.map((s, i) => <SearchSuggestion key={i} result={s}/>)}
					</div>
				:
					<p className="text-gray-300">start searching...</p>
			) || ( 
				searchOption === "Recipes" ?
					<PostsFeed posts={results.map(r=>r.thumbnail)}/>
				:
					<div className="w-full grid grid-cols-2 gap-2">
						{results.map((r, i) => <a href={r.link}
							className={`border-4 rounded-sm p-5 
							flex flex-col gap-2 items-center`}
							key={i}>
								<img src={r.avatar} alt="profile pic"/>
								{r.title}
							</a>
						)}
					</div>
			) }
		</div>}
	</div>
};

function Searchbar(props: {
	className: string, 
	filterState: FilterState, 
	setFilterState: any, 
	collapsible: boolean, 
	results: Result[],
	setResults: any,
	onChange: any,
	showSuggestions?: boolean,
	placeholder?: string,
	noFilter?: boolean,
	onEnter?: any,
}) {
	const {
		className, 
		filterState, 
		setFilterState, 
		collapsible, 
		results,
		setResults,
		onChange,
		showSuggestions,
		noFilter,
		placeholder,
		onEnter,
	} = props

	const [hasText, setHasText] = useState(false);
	const [isFocused, setIsFocused] = useState(false);

	return <div className={`group flex flex-row w-full 
		gap-2 items-center justify-center ml-auto ${className}`}>
		<div className={`
			flex flex-row items-center justify-items-center gap-2 
			overflow-x-clip overflow-y-visible
			${collapsible ? `transition-all duration-300 ease-in-out 
				${hasText ? "w-50" : "w-0 group-hover:w-50"}`
			: ""}
		`}>
			<div className="relative">
				<Input 
					type="text"
					placeholder={placeholder || ""}
					className={`
						bg-white/50 placeholder:text-gray-400
						rounded-full border-0
						transition-all duration-300 ease-in-out 
						ring-0 focus-visible:ring-0
						${collapsible ? hasText ? "w-full opacity-100"
							: "opacity-0 group-hover:opacity-100"
							: ""}`}
					onChange={(e) => {
						setHasText(e.target.value.length > 0);
						onChange(e)			
					}}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							onEnter?.()
						}
					}}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
				/>

				{showSuggestions && <AutocompleteSuggestions focused={isFocused} suggestions={results} />}
			</div>

			{/*!noFilter && <Popover>
				<PopoverContent>
					<FilterCard
					filterState={filterState}
					setFilterState={setFilterState}
					/>
				</PopoverContent>
				<PopoverTrigger>
					<img alt="filters" src="/filters.svg" className="w-8" />
				</PopoverTrigger>
			</Popover>*/}
		</div>
		<button type="button" onClick={() => {onEnter?.()}}>
			<img alt="magnifying glass" src="/search-icon.svg" className="w-5 cursor-pointer"/>
		</button>
	</div>
}

function ToggleGroupSelector(props: {selected, setSelected, options: string[]}) {
	const {selected, setSelected, options} = props
	return (<Field className="w-[200px]">
    	<ToggleGroup
			type="single"
			value={[selected]}
			onValueChange={(value) => setSelected(value)}
			variant="outline"
			spacing={2}
    	>
			{options.map((o, i) => 
				<ToggleGroupItem
					key={i}
					value={o}
					aria-label={o}
					className={`${selected === o ? 'bg-gray-200' : ''}`}
				>
					<span className="text-xs text-muted-foreground">{o}</span>
				</ToggleGroupItem>
			)}
    	</ToggleGroup>
  	</Field>)
}

function AutocompleteSuggestions({ suggestions, className, titleOnly, focused }) {

	if (suggestions.length === 0) return null;

	return (<div
    	className={`
			absolute top-full left-0 right-0 mt-1 w-full
			bg-white border border-gray-200 rounded-xl shadow-md
			${className}
			${!focused && ''}
    	`}
	>
    	{suggestions.map((result, index) => (<div
        	key={index}
        	className={`cursor-pointer text-sm transition-colors duration-100
          	bg-white hover:bg-gray-100 w-full overflow-clip text-nowrap`
		}
      	>
			<SearchSuggestion result={result} client:visible titleOnly/>
      	</div>))}
  	</div>
	);
};

function SearchSuggestion({result: r, titleOnly}: props) {
	const ref = useRef(null);
	const [isVisible, setIsVisible] = useState(true);

	useOnClickOutside(ref, () => setIsVisible(false));

	return isVisible ? <a ref={ref} href={r.link} className={`hover:bg-gray-100`}
	>
		<div className="flex flex-col p-2 w-full items-start h-fit hover:bg-gray-100">
			<p>{r.title}</p>
			{!titleOnly && <p>{r.description}</p>}
		</div>
	</a> : null
}

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener); // Mobile support

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
