export enum PostPermission {
  CREATEPOST = 'CREATEPOST',
  DELETEPOST = 'DELETEPOST',
  EDITPOST = 'EDITPOST',
}
export enum CommentPermission {
  CREATECOMMENT = 'CREATECOMMENT',
  DELETECOMMENT = 'DELETECOMMENT',
  EDITCOMMENT = 'EDITCOMMENT',
}
export enum UserPermission {
  GIVEROLE = 'GIVEROLE',
  CHANGEPROFILEOPTIONS = 'CHANGEPROFILEOPTIONS',
}
const Permission = {
  ...PostPermission,
  ...CommentPermission,
  ...UserPermission,
};

type Permission = PostPermission | CommentPermission | UserPermission;

export default Permission;

`CREATEPOST,
DELETEPOST,
EDITPOST,
CREATECOMMENT,
DELETECOMMENT,
EDITCOMMENT,
GIVEROLE,
CHANGEPROFILEOPTIONS`;
