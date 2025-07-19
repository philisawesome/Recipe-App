"use client"

import { useState } from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "./button"
import {
	Command,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "./command"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "./popover"

import type { FilterState, Option } from "./filter-consts"

interface FilterComboboxProps {
	label: string,
	options: Option[],
	search?: string,
	filterState: FilterState,
	setFilterState: (a: FilterState)=>void,
}

export function FilterCombobox({label, options, search, filterState, setFilterState}: FilterComboboxProps) {
  const [open, setOpen] = useState(false)
  return (<div>
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[150px] flex justify-start truncate"
        >
          <ChevronsUpDownIcon className="h-4 w-4 shrink-0 opacity-50" />
          {filterState.dropdowns[label]
            ? options.find((o) => o.value === filterState.dropdowns[label])?.label
            : "Any"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
		  {search && <CommandInput placeholder={search}/>}
          <CommandList>
            <CommandGroup>
              {options.map((o) => (
                <CommandItem
                  key={o.value}
                  value={o.value}
                  onSelect={(currentValue) => {
					const newVal = currentValue === filterState.dropdowns[label] ? "" : currentValue
					const newFilter = {
						...filterState,
						dropdowns: {
							...filterState.dropdowns,
							[label]: newVal,
						}
					}
                    setFilterState(newFilter)
                    setOpen(false)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      filterState.dropdowns[label] === o.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {o.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
	</div>
  )
}
