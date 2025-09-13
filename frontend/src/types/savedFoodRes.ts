export type SavedFoodRes = {
  food: {
    _id: string;
    video: string;
    description?: string;
    likeCount: number;
    savesCount: number;
    commentsCount: number;
    foodPartner: string;
    isLiked: boolean;
    isSaved: boolean;
  };
};
