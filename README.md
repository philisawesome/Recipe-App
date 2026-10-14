# Stovetop

A social recipe-sharing app. Post your recipes with photos, follow other cooks, and discover new dishes from the community.

**Live site:** [stovetop.cc](https://stovetop.cc)

<!-- TODO: add screenshots / GIF of the feed, a recipe page, and the new-post form -->

## Features

### Accounts & Authentication
- Sign up and log in with username, email, and password
- Passwords hashed with bcrypt
- JWT authentication with access + refresh tokens stored in HTTP-only cookies
- Log out
- Upload and change your profile picture

### Recipe Posts
- Create recipe posts with:
  - Title and description
  - Up to 10 photos (stored on AWS S3)
  - Ingredient list and step-by-step instructions
  - Prep/cook time (days, hours, minutes), servings, and difficulty
- View a recipe's full page with a photo carousel
- Delete your own posts, with a confirmation dialog
- Like and unlike posts

### Feeds
- **Following feed:** posts from you and the people you follow, newest first
- **Discover feed:** recipes from across the community
- Infinite scrolling on both feeds and on profile pages

### Comments
- Comment on recipes
- Threaded replies
- Like and unlike comments

### Social
- User profiles with their posts, follower count, and following count
- Follow and unfollow users
- View follower and following lists

### Search
- Search recipes by title, description, or ingredients
- Search for users by username

### Responsive Design
- Works on mobile and desktop, with a collapsible sidebar

## Tech Stack

### Frontend
- **[Astro](https://astro.build/)**: site framework, builds static pages
- **[React 19](https://react.dev/)**: interactive components (via `@astrojs/react`)
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Tailwind CSS v4](https://tailwindcss.com/)**: styling (with `tw-animate-css`)
- **[shadcn/ui](https://ui.shadcn.com/)**: component library built on **[Radix UI](https://www.radix-ui.com/)**
- **[Material UI (MUI)](https://mui.com/)**: some UI components
- **[Lucide](https://lucide.dev/)**: icons
- **[Nano Stores](https://github.com/nanostores/nanostores)**: shared state (auth store)
- **[React Hook Form](https://react-hook-form.com/)** + **[Zod](https://zod.dev/)**: forms and validation
- **[Axios](https://axios-http.com/)**: HTTP client
- **[Embla Carousel](https://www.embla-carousel.com/)**: image carousel
- **[cmdk](https://cmdk.paco.me/)**: command menu / filter combobox
- **[react-infinite-scroll-component](https://github.com/ankeetmaini/react-infinite-scroll-component)**: infinite scrolling feeds
- **[Vite](https://vitejs.dev/)**: build tooling

### Backend
- **[Node.js](https://nodejs.org/)** (>= 22.12)
- **[Express 5](https://expressjs.com/)**: REST API
- **[MongoDB](https://www.mongodb.com/)** + **[Mongoose](https://mongoosejs.com/)**: database and models
- **[JSON Web Tokens](https://github.com/auth0/node-jsonwebtoken)** + **cookie-parser**: authentication
- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)**: password hashing
- **[Multer](https://github.com/expressjs/multer)**: file uploads
- **[AWS SDK (S3)](https://aws.amazon.com/sdk-for-javascript/)**: image storage
- **CORS**, **dotenv**, **uuid**

### Testing & Dev Tools
- **[Jest](https://jestjs.io/)** + **[Supertest](https://github.com/ladjs/supertest)**: backend/API tests
- **[Nodemon](https://nodemon.io/)**: dev server auto-reload

### Infrastructure
- **AWS S3**: static frontend hosting and image storage
- **AWS CloudFront**: CDN for the frontend
- **Render**: backend API hosting

## Project Structure

```
Recipe-App/
├── recipe-backend/
│   ├── controllers/     # route handlers (auth, posts, comments, users)
│   ├── middleware/      # JWT auth, S3 uploads
│   ├── models/          # Mongoose schemas (User, Post, Comment)
│   ├── routes/          # Express routers
│   ├── utils/           # JWT helpers
│   ├── app.js           # Express app setup
│   ├── index.js         # server entry point
│   ├── seed.js          # seed mock users
│   └── seedPosts.js     # seed mock posts
├── recipe-frontend/
│   ├── src/
│   │   ├── components/  # React components (+ shadcn/ui in components/ui)
│   │   ├── layouts/     # Astro layouts
│   │   ├── pages/       # Astro pages (feed, post, profile, search, ...)
│   │   ├── styles/
│   │   └── assets/      # icons, fonts, public files
│   ├── astro.config.mjs
│   └── deploy-frontend-build-files.sh
└── tests/               # Jest + Supertest backend tests
```

## Getting Started

### Prerequisites
- Node.js >= 22.12
- MongoDB (local or Atlas)
- An AWS S3 bucket for image uploads

### Environment Variables
Create a `.env` file in the project root:

```
MONGO_URI=mongodb://localhost:27017/recipeDB
PORT=4000
FRONTEND_URL=http://localhost:4321
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

The frontend uses `http://localhost:4000/api` in development and the production API otherwise (see `recipe-frontend/src/components/utils.ts`).

### Run Locally

```bash
# Backend (from the project root)
npm install
npm run dev          # starts the Express server on port 4000 with nodemon
npm run seed         # optional: seed mock users
npm run seed:posts   # optional: seed mock posts

# Frontend (in a second terminal)
cd recipe-frontend
npm install
npm run dev          # Astro dev server at http://localhost:4321
```

### Running Tests

```bash
cd tests
mongosh -f load-mock-db.js   # warning: deletes existing data
node populate-db.js
npm test
```

## API Overview

All routes are prefixed with `/api`. 🔒 = requires authentication.

### Auth (`/api/auth`)
| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/register` | Create an account |
| POST | `/login` | Log in |
| POST | `/logout` | Log out |
| POST | `/refresh_token` | Get a new access token |

### Posts
| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/posts` 🔒 | Create a post (multipart, up to 10 photos) |
| GET | `/posts` 🔒 | Following feed |
| POST | `/postDiscover` | Discover feed |
| GET | `/post/:id` | Get a single post |
| PATCH | `/post/:id` 🔒 | Update a post |
| DELETE | `/post/:id` 🔒 | Delete a post |
| PATCH | `/post/:id/like` 🔒 | Like a post |
| PATCH | `/post/:id/unlike` 🔒 | Unlike a post |
| GET | `/userPosts/:id` | Get a user's posts |
| GET | `/searchPost?q=` | Search posts |
| PATCH | `/savePost/:id` 🔒 | Save a post |
| PATCH | `/unsavePost/:id` 🔒 | Unsave a post |
| GET | `/getSavedPost` 🔒 | Get saved posts |

### Comments
| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/comment` 🔒 | Create a comment or reply |
| PATCH | `/comment/:id` 🔒 | Edit a comment |
| DELETE | `/comment/:id` 🔒 | Delete a comment |
| PATCH | `/comment/:id/like` 🔒 | Like a comment |
| PATCH | `/comment/:id/unLike` 🔒 | Unlike a comment |
| GET | `/comment/:id/replies` | Get replies to a comment |

### Users
| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/search?q=` | Search users |
| GET | `/profile/me` 🔒 | Get your own profile |
| GET | `/profile/:id` | Get a user's profile by ID |
| GET | `/username/:username` | Get a user's profile by username |
| POST | `/profile/:id/follow` 🔒 | Follow a user |
| DELETE | `/profile/:id/unfollow` 🔒 | Unfollow a user |
| GET | `/profile/:id/followers` 🔒 | List followers |
| GET | `/profile/:id/following` 🔒 | List following |
| PATCH | `/profilePic/setProfilePic` 🔒 | Upload a profile picture |

## Deployment

- **Frontend:** `recipe-frontend/deploy-frontend-build-files.sh` runs `astro build`, uploads the output to the S3 bucket, and invalidates the CloudFront cache. It needs the AWS CLI configured, and you'll need to update the local `dist` path in the script.
- **Backend:** hosted on Render, started with `npm start` from the project root.

## Roadmap
- [ ] Search filters (meal type, cuisine, price, cook time, dietary tags). The UI is built; the backend still needs support.
- [ ] Saved/bookmarked posts in the UI (backend routes exist)
- [ ] Editing posts and comments in the UI (backend routes exist)

## Contributors
- [Phil Huynh](https://github.com/philisawesome)
- [Albert Duong](https://github.com/alberttduong)

## License
ISC
