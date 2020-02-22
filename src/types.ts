export interface ReadableColorPalette {
  original: string;
  decorative: string;
  readable: string;
  aa: string;
  aaa: string;
}

export type PropsOf<T> = T extends React.ComponentType<infer U> ? U : never;

export type ReactComponent =
  | React.ComponentType<any>
  | keyof JSX.IntrinsicElements
  | string;

type GetStyleObj<UseStylesFn> = UseStylesFn extends (props: {
  styles: Partial<infer U>;
}) => any
  ? U
  : never;

export interface PropsFromStyles<UseStylesFn> {
  surface?: string;
  color?: string;
  style?: React.CSSProperties;
  styles?: Partial<GetStyleObj<UseStylesFn>>;
  className?: string;
}

export interface StyleProps<StylesObj> {
  surface?: string;
  color?: string;
  style?: React.CSSProperties;
  styles?: Partial<StylesObj>;
  className?: string;
}

export type OmitStyleProps<T> = Omit<T, keyof StyleProps<any>>;
export type PropsFromComponent<
  T extends React.ComponentType<any>
> = OmitStyleProps<PropsOf<T>>;

export interface ColorContextValue {
  color: string;
  surface: string;
}