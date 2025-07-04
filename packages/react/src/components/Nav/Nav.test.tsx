import * as React from 'react';

import { fireEvent, render } from '@testing-library/react';
import * as renderer from 'react-test-renderer';

import { Nav } from './Nav';
import { NavBase } from './Nav.base';
import { isConformant } from '../../common/isConformant';
import type { INavLink, IRenderGroupHeaderProps, INavLinkGroup, INavButtonProps } from './Nav.types';
import type { IRenderFunction, IComponentAsProps } from '@fluentui/utilities';

const linkOne: INavLink = {
  key: 'Bing',
  name: 'Bing',
  url: 'http://localhost/#/testing1',
};

const linkTwo: INavLink = {
  key: 'OneDrive',
  name: 'OneDrive',
  url: 'http://localhost/#/testing2',
};

describe('Nav', () => {
  it('renders Nav correctly', () => {
    const component = renderer.create(
      <Nav
        groups={[
          {
            links: [
              {
                name: '',
                url: '',
              },
            ],
          },
        ]}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  isConformant({
    Component: Nav,
    displayName: 'Nav',
    // Problem: Ref is not supported
    // Solution: Convert to FunctionComponent and support using forwardRef
    disabledTests: ['component-has-root-ref', 'component-handles-ref', 'component-handles-classname'],
  });

  it('render Nav with overrides correctly', () => {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    const LinkAs = (props: IComponentAsProps<INavButtonProps>): JSX.Element | null => {
      const { defaultRender: DefaultRender, ...buttonProps } = props;

      if (!DefaultRender) {
        return null;
      }

      return (
        <div data-test="button-override">
          <DefaultRender {...buttonProps} />
        </div>
      );
    };

    // eslint-disable-next-line @typescript-eslint/no-deprecated
    function onRenderNavLink(props?: INavLink, defaultRender?: IRenderFunction<INavLink>): JSX.Element | null {
      if (!props || !defaultRender) {
        return null;
      }

      return <div data-test="link-override">{defaultRender(props)}</div>;
    }

    function onRenderGroupHeader(
      props?: IRenderGroupHeaderProps,
      defaultRender?: IRenderFunction<IRenderGroupHeaderProps>,
      // eslint-disable-next-line @typescript-eslint/no-deprecated
    ): JSX.Element | null {
      if (!props || !defaultRender) {
        return null;
      }

      return <div data-test="header-override">{defaultRender(props)}</div>;
    }
    const groups: INavLinkGroup[] = [
      {
        name: 'Group',
        links: [linkOne, linkTwo],
      },
    ];

    const component = renderer.create(
      <Nav groups={groups} onRenderGroupHeader={onRenderGroupHeader} onRenderLink={onRenderNavLink} linkAs={LinkAs} />,
    );

    expect(component.toJSON()).toMatchSnapshot();
  });

  it('calls onClick() correctly', () => {
    const handler = jest.fn();
    const nav = render(
      <NavBase
        groups={[
          {
            links: [
              {
                name: 'foo',
                url: 'http://example.com',
                onClick: handler,
              },
            ],
          },
        ]}
      />,
    );

    const link = nav.container.querySelector('a.ms-Button') as HTMLAnchorElement;
    fireEvent.click(link);
    expect(handler.mock.calls.length).toBe(1);
  });

  it('do not call onClick() on disabled link', () => {
    const handler = jest.fn();
    const nav = render(
      <NavBase
        groups={[
          {
            links: [
              {
                name: 'foo',
                url: 'http://example.com',
                onClick: handler,
                disabled: true,
              },
            ],
          },
        ]}
      />,
    );

    const link = nav.container.querySelector('button.ms-Button') as HTMLButtonElement;
    fireEvent.click(link);
    expect(handler.mock.calls.length).toBe(0);
  });

  it('sets ARIA label on the nav element', () => {
    const label = 'The navigation label';
    const nav = render(<Nav ariaLabel={label} groups={[]} />);
    expect(nav.container.querySelector('[role="navigation"]')?.getAttribute('aria-label')).toEqual(label);
  });

  it('uses location.href to determine link selected status if state/props is not set', () => {
    const props = { groups: [{ links: [linkOne, linkTwo] }] };
    const nav = render(<Nav {...props} />);
    window.history.pushState({}, '', '/#/testing1');
    nav.rerender(<Nav {...props} />);

    expect(nav.container.querySelectorAll('.ms-Nav-compositeLink.is-selected').length).toBe(1);
    expect(nav.container.querySelectorAll('.ms-Nav-compositeLink.is-selected')[0].textContent).toEqual(linkOne.name);
  });

  it('prioritizes state over location.href to determine link selected status', () => {
    const props = { groups: [{ links: [linkOne, linkTwo] }] };
    const nav = render(<Nav {...props} />);
    window.history.pushState({}, '', '/#/testing2');
    nav.rerender(<Nav {...props} />);

    fireEvent.click(nav.container.querySelector('.ms-Button') as HTMLButtonElement);
    expect(nav.container.querySelectorAll('.ms-Nav-compositeLink.is-selected').length).toBe(1);
    expect(nav.container.querySelectorAll('.ms-Nav-compositeLink.is-selected')[0].textContent).toEqual(linkOne.name);
  });

  it('places the correct values on rel depending on the url and target specified', () => {
    const linkWithNoTargetSpecified: INavLink = {
      key: 'Link1',
      name: 'Link1',
      url: 'https://cdpn.io/bar',
    };
    const linkWithRelativeURL: INavLink = {
      key: 'Link2',
      name: 'Link2',
      target: '_blank',
      url: '/foo',
    };
    const linkWithNonRelativeURL: INavLink = {
      key: 'Link3',
      name: 'Link3',
      target: '_blank',
      url: 'https://cdpn.io/bar',
    };
    const linkWithNonRelativeURL2: INavLink = {
      key: 'Link4',
      name: 'Link4',
      target: '_blank',
      url: 'http://cdpn.io/bar',
    };
    const nav = render(
      <Nav
        groups={[
          { links: [linkWithNoTargetSpecified, linkWithRelativeURL, linkWithNonRelativeURL, linkWithNonRelativeURL2] },
        ]}
      />,
    );

    const links = nav.container.querySelectorAll('.ms-Nav-link');
    expect(links.length).toBe(4);
    expect(links[0].getAttribute('rel')).toBeFalsy();
    expect(links[1].getAttribute('rel')).toBeFalsy();
    expect(links[2].getAttribute('rel')).toBe('noopener noreferrer');
    expect(links[3].getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('updates header expanded state based on isExpanded prop correctly', () => {
    const groups: INavLinkGroup[] = [
      {
        name: 'Nav Component',
        expandAriaLabel: 'Expanded',
        collapseAriaLabel: 'Collapsed',
        isExpanded: true,
        links: [
          {
            key: 'LinkItem',
            name: 'LinkItem',
            url: '#/examples/linkitem',
          },
        ],
      },
    ];

    const nav = render(<Nav groups={groups} />);

    expect(nav.container.querySelector('.ms-Nav-chevronButton')?.getAttribute('aria-expanded')).toEqual('true');

    //update groups isExpanded state to false
    const updatedGroups = [{ ...groups[0], isExpanded: false }];
    nav.rerender(<Nav groups={updatedGroups} />);

    expect(nav.container.querySelector('.ms-Nav-chevronButton')?.getAttribute('aria-expanded')).toEqual('false');
  });
});
