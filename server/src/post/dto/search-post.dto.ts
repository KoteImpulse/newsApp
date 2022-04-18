export class SearchPostDto {
  title?: string;
  body?: string;
  maindescription?: string;
  views?: 'DESC' | 'ASC';
  tags?: string;
  take?: number;
  skip?: number;
  tag?: string;
  lastPostId?: number;
  firstPostId?: number;
}
