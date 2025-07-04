import * as React from 'react';
import { DocsContainer, type DocsContextProps } from '@storybook/addon-docs';
import { type FluentStoryContext } from '@fluentui/react-storybook-addon';
import { webLightTheme, FluentProvider } from '@fluentui/react-components';

interface FluentDocsContainerProps {
  context: FluentStoryContext & DocsContextProps;
  children: React.ReactNode;
}

/**
 * A container that wraps storybook's native docs container to add extra components to the docs experience
 */
export const FluentDocsContainer: React.FC<FluentDocsContainerProps> = ({ children, context }) => {
  return (
    <>
      {/** TODO add table of contents */}
      <FluentProvider className="sb-unstyled" style={{ backgroundColor: 'transparent' }} theme={webLightTheme}>
        <DocsContainer context={context}>{children}</DocsContainer>
      </FluentProvider>
    </>
  );
};
