export type LostItemType = "lost" | "found";

export type LostItem = {
  id: string;
  title: string;
  image: string;
  location: string;
  timeAgo: string;
  status: LostItemType;
  category: string;
  isMine?: boolean;
};