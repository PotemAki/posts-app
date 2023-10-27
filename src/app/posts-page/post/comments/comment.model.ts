export interface CommentModel {
  id?: string,
  postId: string;
  commentCreatorName: string;
  commentContent: string;
  commentDate: string;
  commentEditDate?: string;
}
