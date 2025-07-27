import * as React from "react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

import { Input } from "./input"

import { DefaultFilter } from "./filter-consts"
import { FilterCard } from "./filter-card"

function Search({ className, type, ...props }: React.ComponentProps<"input">) {
	const [filterState, setFilterState] = React.useState(DefaultFilter())

	return <div className="flex gap-2">
		<img src="/search-icon.svg" className="w-5"/>
		<Input
			type={type}
			className={className}
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
				<img src="/filters.svg" className="w-7"/>
			</PopoverTrigger>
		</Popover>
	</div>
}

export { Search }
