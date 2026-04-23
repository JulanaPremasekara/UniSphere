export type LostItemType = "lost" | "found";

export type LostItem = {
  id: string;
  title: string;
  imageUrl: string;
  location: string;
  timeAgo: string;
  type: LostItemType;
  category: string;
  isMine?: boolean;
};