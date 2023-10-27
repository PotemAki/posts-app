export interface Post {
  id: string;
  creatorName: string;
  content: string;
  postDate: string;
  editDate?: string;
  imagePath?: string;
  likes?: string;
  likeUpdate?: boolean;
  likesArray?: string | object
}
