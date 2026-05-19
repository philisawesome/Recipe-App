import * as React from "react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"

import { Input } from "./ui/input"

import { DefaultFilter } from "./ui/filter-consts"
import { FilterCard } from "./ui/filter-card"

export function SearchResult({title, description}: any) {
	return <div className="flex flex-col w-full items-start h-fit">
		<b>{title}</b>
		<p>{description}</p>
	</div>
}

 
import { useState, useEffect } from "react"

export function Searchbar({ className, type, ...props }: React.ComponentProps<"input">) {
	const [filterState, setFilterState] = React.useState(DefaultFilter())

	return <div className={`
			flex flex-row gap-2 items-center 
			${className}`}>
		<img alt="magnifying glass" src="/search-icon.svg" className="w-5"/>
		<Input
			type={type}
			className="rounded-full"
			{...props}
		/>
		<Popover>
			<PopoverContent>
				<FilterCard 
					filterState={filterState}
					setFilterState={setFilterState}
				/>
			</PopoverContent>
			<PopoverTrigger>
				<img alt="filters" src="/filters.svg" className="w-7"/>
			</PopoverTrigger>
		</Popover>
	</div>
}
