export interface EditorData {
  id: string;
  type: string;
  data: BlockToolData<any>;
  tunes?: { [name: string]: BlockTuneData };
}

export interface CategoryList {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
}

export interface OutputBlockData<
  Data extends Record<string, unknown>,
  Type extends string = string,
> {
  type: Type;
  data: BlockToolData<Data>;
  tunes?: { [name: string]: BlockTuneData };
  id?: string;
}

export type BlockToolData<T extends Record<string, unknown>> = T;
export type BlockTuneData = any;

export const categories: CategoryList[] = [
  {
    id: 0,
    title: 'Прочее',
    slug: 'other',
    description: 'Все стать на разные темы',
    image: '/categoryLogo/logo0.jpg',
  },
  {
    id: 1,
    title: 'Музыка',
    slug: 'music',
    description: 'Описание категории',
    image: '/categoryLogo/logo1.jpg',
  },
  {
    id: 2,
    title: 'Фильмы',
    slug: 'cinema',
    description: 'Описание категории',
    image: '/categoryLogo/logo2.jpg',
  },
];
