export interface AuthInitialState {
  mode: string;
  user: UserType | null;
  profile: UserType | null;
  mockIMG: string;
  loading: boolean;
  token: string | null;
  friends: UserType[];
  isRegisterSuccess: boolean;
  isLoginSuccess: boolean;
  isEditSuccess: boolean;
}

export interface PostInitialState {
  posts: PostType[];
  loading: boolean;
}

export interface UserType {
  _id?: string;
  dateOfBirth: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  occupation: string;
  location: string;
  picturePath?: string;
  friends?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PostType {
  _id?: string;
  userId: string;
  firstName: string;
  lastName: string;
  description?: string;
  userPicturePath?: string;
  picturePath?: string;
  likes?: string[];
  comments?: CommentType[];
  createdAt?: Date;
}

export interface PostPayload {
  userId?: string;
  description?: string;
}

export interface CommentType {
  firstName: string;
  lastName: string;
  userPicturePath?: string;
  description: string;
}

export interface ChatHistory {
  _id?: string;
  sender: string;
  receiver: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePostProps {
  userId: string;
  description: string;
  uploadedFile: File | null;
}

export interface RegisterProps {
  user: UserType;
  uploadedFile: File | null;
}
