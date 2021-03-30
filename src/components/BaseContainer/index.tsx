import * as React from 'react';
import { Box, BoxProps } from 'grommet';
import { Head } from 'components';
import { MainFooter } from 'components';
import { withTheme } from 'styled-components';
import { IStyledChildrenProps } from 'interfaces';
//import * as styles from './styles.styl';

export const BaseContainer: React.FC<IStyledChildrenProps<BoxProps>> = withTheme(
  ({ theme, children, ...props }: IStyledChildrenProps<BoxProps>) => {
    const { palette, container } = theme;
    const { minWidth, maxWidth } = container;
    return (
      <>
        {/*<div className={styles.backgroundImage} />*/}
        {/*<div className={styles.blur} />*/}
        <div
          style={{
            minHeight: '100%',
            zIndex: 5,
            position: 'absolute',
            top: 0,
            width: '100vw',
            background: 'linear-gradient(0deg, rgba(248,236,153,1) 0%, rgba(255,255,255,1) 100%)'
          }}
        >
          <Head />
          <Box
            style={{
              minWidth,
              maxWidth,
              margin: '120px auto 52px',
              height: 'calc(100% - 388px)',
              minHeight: '586px',
            }}
            {...props}
          >
            {children}
          </Box>
          <MainFooter />
        </div>
      </>
    );
  },
);
