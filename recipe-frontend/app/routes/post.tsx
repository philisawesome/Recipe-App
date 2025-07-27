import { AvatarCard } from "../components/avatar-card"
import { Separator } from "../components/ui/separator"
import { 
	Carousel, 
	CarouselItem,
	CarouselContent,
	CarouselNext,
	CarouselPrevious,
} from "../components/ui/carousel"
import {
  Sidebar,
  SidebarInset,
  SidebarContent,
  SidebarTrigger,
  SidebarRail,
  SidebarFooter,
  SidebarGroup,
  SidebarProvider,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "../components/ui/sidebar"
import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { 
	Avatar, 
	AvatarImage, 
	AvatarFallback 
} from "../components/ui/avatar"

function PostSidebar() {
	return (<Sidebar variant="inset" side="left" className="text-xs">
		<SidebarHeader>
			<p>Peach Cobbler (@linecook)</p>
		</SidebarHeader>
		<SidebarContent className="p-2">
			<SidebarGroup>
				<div className="flex gap-2">
				<Button className="w-fit" variant="outline">Like</Button>
				<Button className="w-fit" variant="ghost">Follow @linecook</Button>
				</div>
			</SidebarGroup>
			<SidebarGroup>
				<SidebarGroupLabel>Comments</SidebarGroupLabel>
				<SidebarMenu>
					{Array.from({length: 8}, () => { 
						return <SidebarMenuItem>		
						<div className="flex items-center">
							<Avatar className="m-2">
								<AvatarImage src="" />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<b>ChefJon</b>
						</div>
						<p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu</p>
					</SidebarMenuItem>		
					})}
				</SidebarMenu>
			</SidebarGroup>
		</SidebarContent>
		<SidebarRail/>
	</Sidebar>)

}

function PostContent() {
	const rating = 4.5
	return <div className="w-screen flex flex-col items-center">
		<div className="w-xl mb-10">
			<div className="flex items-center gap-2">
				<h1>Peach cobbler</h1>
			</div>
			<AvatarCard className="mb-3"/>
			<div className="flex">
				{ Array.from({length: rating},() =>
				<img width="12rem" src="/star.svg"/>) }
			</div>
			<p>{rating + "/5 (30 reviews)"}</p>
		</div>
		<Carousel className="w-1/2">
			<CarouselContent className="h-[30rem]">
				<CarouselItem className="h-full flex">
					<img className="w-full object-contain" src="https://www.allrecipes.com/thmb/ssGwvBmMa2Mpfjw6vtjGMK8S3Rc=/0x512/filters:no_upscale():max_bytes(150000):strip_icc()/51535-fresh-southern-peach-cobbler-ddmfs-0652-3x4-1-b34274d227264edabd5e6fb115ba0eab.jpg"/>
				</CarouselItem>
				<CarouselItem className="h-full flex">
					<img className="w-full object-contain" src="https://homegrownhappiness.com/wp-content/uploads/2024/01/sourdough-peach-cobbler-recipe-biscuits.jpg"/>
				</CarouselItem>
			</CarouselContent>
			<CarouselPrevious/>
			<CarouselNext/>
		</Carousel>
		<div className="w-xl mt-12 grid grid-cols-2 text-sm">
			<div>
				<h3>Ingredients</h3>
				<ul>
					<li>1 cup of flour</li>
					<li>sugar</li>
					<li>flour</li>
					<li>flour</li>
					<li>sugar</li>
					<li>sugar</li>
				</ul>
			</div>
			<div>Recipe description: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
			</div>
			<div className="col-span-2">
				<h2>Instructions</h2>
				<h3>Step 1</h3>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.My famous peach cobbler recipe</p>
				<h3>Step 2</h3>
				<p>My famous peach cobbler recipeLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
			</div>
			<h2 className="mt-10">Comment</h2>
			<Textarea className="col-span-2 mb-10" placeholder="Comment..."/>
		</div>
	</div>;
}

export default function Post() {
	const s: any = {"--sidebar-width": "20rem",}
	return <SidebarProvider defaultOpen={true}
		style={s}>
		<SidebarInset>
			<PostContent/>
		</SidebarInset>
		<PostSidebar/>
	</SidebarProvider>
}
