# React style system

> a lean, component-centric style system for React components

## ⚠️ This library is still in heavy development with the best features coming soon

Watch releases to be notified for new features.

## Features

- 🎣 hooks API
- 👩‍🎨 theming
- 🎨 advanced color context features including **dark mode**
- 🧩 composable styles by default
- 📦 small size, [6.6kB](https://bundlephobia.com/result?p=react-style-system)

**Features coming soon**

The best feature of this library are still in development!

- static CSS via [Babel Plugin](https://github.com/ricokahler/react-style-system/tree/master/packages/babel-plugin-plugin) (similar to Linaria)
- SSR support
- much smaller bundle [1.9kB](https://bundlephobia.com/result?p=@react-style-system/ssr)
- performance improvements

## Installation

### Install

```
npm i --save react-style-system
```

### Create your theme

`react-style-system`'s theming works by providing an object to all your components. This theme object should contain values to keep your app's styles consistent.

[See theming usage for more info](#theming-usage)

```ts
// /src/theme.ts (or /src/theme.js)

const theme = {
  // see theming usage for more info
  colors: {
    brand: 'palevioletred',
    accent: 'peachpuff',
    surface: 'white',
  },
};

export default theme;
```

### Provider installation

```tsx
// index.ts (or index.js)
import React from 'react';
import { render } from 'react-dom';
import theme from './theme';
import App from './App';

const container = document.querySelector('#root');

render(
  <ThemeProvider theme={theme}>
    <ColorContextProvider
      color={theme.colors.accent}
      surface={theme.colors.surface}
    >
      <App />
    </ColorContextProvider>
  </ThemeProvider>,
  container,
);
```

### Add type augments

If you're using typescript or an editor that supports the typescript language service (VS Code), you'll need to add one more file to configure the types and intellisense.

Place this file at the root of your project.

```tsx
// /arguments.d.ts
import {
  StyleFnArgs,
  ReactComponent,
  StyleProps,
  GetComponentProps,
} from 'react-style-system';

declare module 'react-style-system' {
  // this should import your theme
  type Theme = typeof import('./src/theme').default;

  // provides an override type that includes the type for your theme
  export function useTheme(): Theme;

  // provides an override type that includes the type for your theme
  export function createStyles<Styles, ComponentType extends ReactComponent>(
    stylesFn: (args: StyleFnArgs<Theme>) => Styles,
  ): <Props extends StyleProps<Styles>>(
    props: Props,
    component?: ComponentType,
  ) => {
    Root: React.ComponentType<GetComponentProps<ComponentType>>;
    styles: { [P in keyof Styles]: string } & {
      cssVariableObject: { [key: string]: string };
    };
  } & Omit<Props, keyof StyleProps<any>>;
}
```

### VS Code Extension

If you're using VSCode, we recommend installing the `vscode-styled-components` by [the styled-components team](https://github.com/styled-components/vscode-styled-components). This will add syntax highlighting for our style of CSS-in-JS.

### CodeSandbox

[See CodeSandbox for a full setup](#todo)

## Usage

### Basic Usage

```tsx
// Card.tsx
import React from 'react';
import { createStyles, PropsFromStyles } from 'react-style-system';

// `react-style-system` works by creating a hook that intercepts your props
const useStyles = createStyles(({ css, theme }) => ({
  // here you return an object of styles
  root: css`
    padding: 1rem;
    background-color: peachpuff;
    /* you can pull in your theme like so */
    border-right: 5px solid ${theme.colors.brand};
  `,
  title: css`
    font-weight: bold;
    font-weight: 3rem;
    margin-bottom: 1rem;
  `,
  description: css`
    line-height: 1.5;
  `,
}));

// write your props like normal, just add the `extends…` like so:
interface Props extends PropsFromStyles<typeof useStyles> {
  title: React.ReactNode;
  description: React.ReactNode;
}

function Card(props: Props) {
  // `useStyles` intercepts your props
  const {
    // `Root` and `styles` are props added via `useStyles
    Root,
    styles,
    // `title` and `description` are the props you defined
    title,
    description,
  } = useStyles(props);

  return (
    // the `root` class is automatically applied to the `Root` component
    <Root>
      {/* the styles that come back are class names */}
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
    </Root>
  );
}

export default Card;
```

[See in CodeSandbox](#todo)

### Composability

`react-style-system`'s styles are composable by default. This means that every style you write can be augmented and style props like `className` and `style` are automatically propagated to the subject `Root` component.

Building from the example above:

```tsx
// Grid.tsx
import React from 'react';
import { createStyles, PropsFromStyles } from 'react-style-system';
import Cart from './Card';

const useStyles = createStyles(({ css }) => ({
  root: css`
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(3, 1fr);
  `,
  card: css`
    /* TODO */
    box-shadow: 0 0 1px 1px;
  `,
  titleUnderlined: css`
    text-decoration: underlined;
  `,
}));

interface Props extends PropsFromStyles<typeof useStyles> {}

function Grid(props: Props) {
  const { Root, styles } = useStyles(props);

  return (
    <Root>
      <Card
        // augments the `root` class in the Card
        className={styles.card}
        styles={{
          // augments the `title` class in `Card`
          title: styles.titleUnderlined,
        }}
        title="react-style-system"
        description={
          <>a lean, component-centric style system for React components</>
        }
      />

      <Card
        className={styles.card}
        title="emotion"
        description={
          <>CSS-in-JS library designed for high performance style composition</>
        }
      />

      <Card
        className={styles.card}
        title="styled-components"
        description={
          <>
            Visual primitives for the component age. Use the best bits of ES6
            and CSS to style your apps without stress
          </>
        }
      />
    </Root>
  );
}
```

### Dynamic Coloring

Every component styled with `react-style-system` supports dynamic coloring. This means you can pass the prop `color` to it and use that color when defining styles.

```tsx
// passing the color prop
<Button color="red">My Red Button</Button>
```

```tsx
// using the color prop to define styles
import React from 'react';
import { createStyles, PropsFromStyles } from 'react-style-system';

// the `color` prop comes through here  👇
const useStyles = createStyles(({ css, color, surface }) => ({
  //                                           👆
  // additionally, there is another prop `surface` that hold the color of the
  // surface this component is on currently. this is usually black for dark mode
  // and white for non-dark modes
  root: css`
    border: 1px solid ${color.decorative};
    background-color: ${surface};
    color: ${color.readable};
  `,
}));

interface Props extends PropsFromStyles<typeof useStyles> {
  children: React.ReactNode;
  onClick: () => void;
}

function Button(props: Props) {
  const { Root, children, onClick } = useStyles(props, 'children');
  return <Root onClick={onClick}>{children}</Root>;
}

export default Button;
```

[See this demo in CodeSandbox](https://codesandbox.io/s/dynamic-coloring-7dr3n)

### Color System Usage

`react-style-system` ships with a simple yet robust color system. You can wrap your components in `ColorContextProvider`s to give your components context for what color they should expect. This works well when supporting dark mode.

[See here for a full demo of color context.](https://codesandbox.io/s/nested-color-system-demo-qphro)

### Theming Usage

Theming is also pretty simple in `react-style-system`. Wrap your App in a `ThemeProvider` and give that `ThemeProvider` a theme object. That `theme` object will be available for use in all your components. See the [provider installation](#provider-installation) for more info.

After your wrap in a theme provider, you can access the theme via the args in `createStyles`:

```tsx
//                                     👇👇👇
const useStyles = createStyles(({ css, theme }) => ({
  root: css`
    color: ${theme.colors.brand};
  `,
}));
```

And inside your component, you can access the theme via `useTheme()`

```tsx
function Component(props: Props) {
  const theme = useTheme();

  // ...
}
```

## Enabling the experimental babel plugin

Docs coming soon…

Contact me at [ricokahler@me.com](mailto:ricokahler@me.com) if you're interesting in hearing more.

## Why another CSS-in-JS lib?

[See here for more info](./why-another-css-in-js-lib.md)