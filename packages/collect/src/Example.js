import React from 'react';
import { createStyles } from 'react-style-system';
import getRed from './submodule';

const useStyles = createStyles(({ css, theme }) => ({
  root: css`
    height: ${theme.block(5)};
    display: flex;
    flex-direction: column;
    overflow: hidden;
    color: ${getRed()};
  `,
  title: css`
    ${theme.fonts.h4};
    flex: 0 0 auto;
    margin-bottom: ${theme.space(1)};
    color: ${theme.colors.brand};

    ${theme.down(theme.tablet)} {
      ${theme.fonts.h5};
    }
  `,
  body: css`
    ${theme.fonts.body1}
    flex: 1 1 auto;
  `,
}));

function Card(props) {
  const { Root, styles, title, description } = useStyles(props);

  return (
    <Root>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.body}>{description}</p>
    </Root>
  );
}

export default Card;
