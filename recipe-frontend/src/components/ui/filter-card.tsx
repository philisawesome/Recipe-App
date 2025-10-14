import { useState } from "react"
import { Button } from "./button"
import {
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "./card"
import { Label } from "./label"
import { Toggle } from "./toggle"
import { Slider } from "./slider"
import type { FilterState, Option } from "./filter-consts"
import { FilterCombobox } from "./filter-combobox"
import { LabelToOptions,TogglableOptions, DefaultFilter } from "./filter-consts"

function ToOptions(label: string): Option[] {
	if (label in LabelToOptions) {
		return LabelToOptions[label]
	}
	console.log(`Label '${label}' has no options`)
	return []
}

interface DropdownProps {
	label: string,
	search?: string,
	filterState: FilterState,
	setFilterState: (a: FilterState)=>void,
}

function FilterDropdown({label, search, filterState, setFilterState}: DropdownProps) {
	const title = label.charAt(0).toUpperCase() + label.substring(1)
	return <div className="flex justify-between">
		<Label>{title}</Label>
		<FilterCombobox
			label={label}
			options={ToOptions(label)}
			search={search}
			filterState={filterState}
			setFilterState={setFilterState}
		/>
	</div>
}

interface FilterProps {
	filterState: FilterState,
	setFilterState: (a: FilterState)=>void
}
export function FilterCard({filterState, setFilterState}: FilterProps) {
	const [timeLabel, setTimeLabel] = useState(maxTimeLabel)
	
	function maxTimeLabel() {
		const h = filterState.maxTime[0] / 60
		if (h == 0) {
			return "N/A"
		} else if (h == 0.5) {
			return "30 minutes"
		}
		return h + " hours"
	}

	return (<div>
		<CardHeader className="flex items-center justify-between mb-2">
			<CardTitle>Filter Search</CardTitle>
			<CardAction>
				<Button
					variant="secondary"
					onClick={() => {
						setFilterState(DefaultFilter())
					}}
				>Reset</Button>
			</CardAction>
		</CardHeader>
		<CardContent className="flex flex-col gap-2">
			<FilterDropdown
				label="meal"
				filterState={filterState} setFilterState={setFilterState}
			/>
			<FilterDropdown
				label="price"
				filterState={filterState} setFilterState={setFilterState}
			/>
			<FilterDropdown
				label="cuisine"
				search="Search cuisine"
				filterState={filterState} setFilterState={setFilterState}
			/>
			<div className="inline">
				{TogglableOptions.map((opt: Option, i: number) => {
					return <Toggle 
								key={i} value={opt.value}
								defaultPressed={filterState.toggled[opt.value]}
								pressed={filterState.toggled[opt.value]}
								
								onPressedChange={() => {
									setFilterState({
										...filterState,
										toggled: {
											...filterState.toggled,
											[opt.value]: !filterState.toggled[opt.value]}})
									console.log(filterState)
								}}>
						{opt.label}
						</Toggle>
				})}
			</div>
			<Label className="">Max Time: {timeLabel}</Label>
			<Slider
				defaultValue={filterState.maxTime}
				min={0} max={360}
				step={30}
				onValueChange={(t: number[]) => {
					filterState.maxTime = t
					setTimeLabel(maxTimeLabel())
				}}
			/>
		</CardContent>
	</div>)
}
