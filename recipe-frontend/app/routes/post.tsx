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
import {
	useAuth
} from "../hooks/use-auth"

type PostData = {
	author: string
	yourPost: boolean,
	followedAuthor?: boolean
	liked?: boolean
	title: string
	body: string
	//comments: {}[]
}

const _postContent: PostData = {
	author: 'linecook',
	yourPost: true,
	title: 'Peach Cobbler',
	body: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu',
}

const postContent: PostData = {
	author: 'justin',
	yourPost: false,
	followedAuthor: true,
	liked: true,
	title: 'Peach Cobbler',
	body: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu',
}

const _detailed = false

function PostSidebar(props: {data: PostData}) {
	const auth = useAuth()
	const post = props.data
	
	return (<Sidebar variant="inset" side="left" className="text-xs">
		<SidebarHeader>
			<p>{post.title} by @{post.author}</p>
			<p className="text-sm">39 likes</p>
		</SidebarHeader>
		<SidebarContent className="p-2">
			{auth.loggedIn && <SidebarGroup>
				<div className="flex gap-2">
				<Button 
					className="w-fit bg-(--color-light-1)" 
					variant="outline"
				>Like</Button>
				<Button className="w-fit" variant="ghost">Follow @linecook</Button>
				</div>
			</SidebarGroup>}
			{/*
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
			*/}
		</SidebarContent>
		<SidebarRail/>
	</Sidebar>)

}

function PostContent(props: {data: PostData}) {
	const auth = useAuth()
	const post = props.data

	return <div className="w-screen flex flex-col items-center">
		<div className="w-xl mb-10">
			<div className="flex items-center gap-2">
				<h1>{post.title}</h1>
			</div>
			<AvatarCard className="mb-3"/>
			{/*
			<div className="flex">
				{ Array.from({length: rating},() =>
				<img width="12rem" src="/star.svg"/>) }
			</div>
			<p>{rating + "/5 (30 reviews)"}</p>
			*/}
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
		   	<div className="col-span-2">{post.body}</div>
			{/*
			{auth.loggedIn && <div className="col-span-2 flex flex-col gap-2 mt-10">
				<Textarea className="col-span-2" placeholder="write a comment..."/>
				<Button className="w-fit self-end" variant="secondary">Comment</Button>
			</div>}
			*/}
		</div>
	</div>;
}

export default function Post() {
	const s: any = {"--sidebar-width": "20rem",}
	return <SidebarProvider defaultOpen={true}
		style={s}>
		<SidebarInset>
			<PostContent data={postContent}/>
		</SidebarInset>
		<PostSidebar data={postContent}/>
	</SidebarProvider>
}
