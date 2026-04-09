export interface Root {
  message: string;
  statusMsg: string;
  status: string;
  metadata: Metadata;
}

export interface Metadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage: number;
}
