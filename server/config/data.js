export const users = [
  {
    id: 1,
    username: "alex_borrower",
    githubid: "github_alex",
    avatarurl: "https://avatars.githubusercontent.com/u/1?v=4",
    accesstoken: "token_alex",
    role: "borrower",
    rating: 4.75,
    created_at: "2025-01-15T10:20:00Z"
  },
  {
    id: 2,
    username: "jordan_lends",
    githubid: "github_jordan",
    avatarurl: "https://avatars.githubusercontent.com/u/2?v=4",
    accesstoken: "token_jordan",
    role: "lender",
    rating: 4.92,
    created_at: "2025-01-20T14:33:00Z"
  },
  {
    id: 3,
    username: "casey_both",
    githubid: "github_casey",
    avatarurl: "https://avatars.githubusercontent.com/u/3?v=4",
    accesstoken: "token_casey",
    role: "both",
    rating: 4.60,
    created_at: "2025-02-01T09:00:00Z"
  },
  {
    id: 4,
    username: "sam_gadgets",
    githubid: "github_sam",
    avatarurl: "https://avatars.githubusercontent.com/u/4?v=4",
    accesstoken: "token_sam",
    role: "lender",
    rating: 4.30,
    created_at: "2025-03-05T12:10:00Z"
  },
  {
    id: 5,
    username: "taylor_borrower",
    githubid: "github_taylor",
    avatarurl: "https://avatars.githubusercontent.com/u/5?v=4",
    accesstoken: "token_taylor",
    role: "borrower",
    rating: 4.85,
    created_at: "2025-03-10T16:45:00Z"
  }
];

export const items = [
  {
    id: 1,
    title: "Cordless Drill",
    description: "A reliable DeWalt 18V drill with two batteries and charger.",
    category: "Tools",
    location: "Chicago, IL",
    available: true,
    post_type: "lend",
    rent_price: 10.00,
    user_id: 2, // jordan_lends
    created_at: "2025-03-12T09:15:00Z"
  },
  {
    id: 2,
    title: "Camping Tent (4-person)",
    description: "Waterproof, easy to set up, great for weekend trips.",
    category: "Outdoors",
    location: "Denver, CO",
    available: false,
    post_type: "lend",
    rent_price: 25.00,
    user_id: 4, // sam_gadgets
    created_at: "2025-03-18T10:00:00Z"
  },
  {
    id: 3,
    title: "Mountain Bike",
    description: "Lightweight aluminum frame, recently tuned up.",
    category: "Sports",
    location: "Portland, OR",
    available: true,
    post_type: "lend",
    rent_price: 35.00,
    user_id: 3, // casey_both
    created_at: "2025-04-01T08:00:00Z"
  },
  {
    id: 4,
    title: "GoPro Hero 11",
    description: "Perfect for capturing outdoor adventures.",
    category: "Electronics",
    location: "Austin, TX",
    available: true,
    post_type: "lend",
    rent_price: 15.00,
    user_id: 4,
    created_at: "2025-04-02T11:00:00Z"
  },
  {
    id: 5,
    title: "Lawn Mower",
    description: "Electric mower with rechargeable battery.",
    category: "Gardening",
    location: "Columbus, OH",
    available: true,
    post_type: "lend",
    rent_price: 12.00,
    user_id: 2,
    created_at: "2025-04-10T13:45:00Z"
  },
  {
    id: 6,
    title: "Power Washer",
    description: "High pressure washer for driveways and decks.",
    category: "Home Improvement",
    location: "Columbus, OH",
    available: true,
    post_type: "borrow",
    rent_price: null,
    user_id: 1,
    created_at: "2025-04-15T08:30:00Z"
  }
];

export const requests = [
  {
    id: 1,
    item_id: 1,
    borrower_id: 1, // alex requests drill
    status: "accepted",
    message: "Can I borrow this for the weekend?",
    created_at: "2025-03-13T12:00:00Z"
  },
  {
    id: 2,
    item_id: 2,
    borrower_id: 5,
    status: "pending",
    message: "Looking to use this tent for a camping trip next week.",
    created_at: "2025-03-20T08:40:00Z"
  },
  {
    id: 3,
    item_id: 3,
    borrower_id: 5,
    status: "rejected",
    message: "Would like to borrow this for 3 days.",
    created_at: "2025-04-05T10:15:00Z"
  },
  {
    id: 4,
    item_id: 4,
    borrower_id: 3,
    status: "accepted",
    message: "Need this GoPro for my travel vlog project.",
    created_at: "2025-04-03T09:00:00Z"
  }
];

export const follows = [
  { follower_id: 1, following_id: 2 }, // alex → jordan
  { follower_id: 1, following_id: 3 }, // alex → casey
  { follower_id: 3, following_id: 2 }, // casey → jordan
  { follower_id: 4, following_id: 2 }, // sam → jordan
  { follower_id: 5, following_id: 4 }, // taylor → sam
  { follower_id: 5, following_id: 3 }  // taylor → casey
];

export const ratings = [
  {
    id: 1,
    rated_by: 1,
    rated_user: 2,
    score: 5.00,
    review: "Drill was in perfect condition, very responsive lender.",
    created_at: "2025-03-16T11:30:00Z"
  },
  {
    id: 2,
    rated_by: 3,
    rated_user: 4,
    score: 4.50,
    review: "Easy communication and great item condition.",
    created_at: "2025-04-04T13:00:00Z"
  },
  {
    id: 3,
    rated_by: 5,
    rated_user: 2,
    score: 4.80,
    review: "Reliable lender, would borrow again.",
    created_at: "2025-04-08T17:20:00Z"
  },
  {
    id: 4,
    rated_by: 2,
    rated_user: 1,
    score: 4.70,
    review: "Returned the item on time and clean.",
    created_at: "2025-03-18T10:45:00Z"
  }
];
