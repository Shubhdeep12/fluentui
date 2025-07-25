import * as React from 'react';

import { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { HoverCard, HoverCardType, IExpandingCardProps } from '@fluentui/react/lib/HoverCard';
import { classNamesFunction, find, getNativeProps, buttonProperties } from '@fluentui/react/lib/Utilities';
import { ResizeGroup } from '@fluentui/react/lib/ResizeGroup';
import { IProcessedStyleSet } from '@fluentui/react/lib/Styling';
import { OverflowSet, IOverflowSetItemProps } from '@fluentui/react/lib/OverflowSet';
import { FocusZone, FocusZoneDirection, FocusZoneTabbableElements } from '@fluentui/react-focus';
import {
  ILegend,
  ILegendsProps,
  LegendShape,
  ILegendsStyles,
  ILegendStyleProps,
  ILegendOverflowData,
  ILegendContainer,
} from './Legends.types';
import { Shape } from './shape';
import { cloneLegendsToSVG } from '../../utilities/image-export-utils';

const getClassNames = classNamesFunction<ILegendStyleProps, ILegendsStyles>();

// This is an internal interface used for rendering the legends with unique key
interface ILegendItem extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name?: string;
  title: string;
  action: VoidFunction;
  hoverAction: VoidFunction;
  onMouseOutAction: VoidFunction;
  color: string;
  shape?: LegendShape;
  key: number;
  opacity?: number;
  stripePattern?: boolean;
  isLineLegendInBarChart?: boolean;
}

export interface ILegendState {
  activeLegend: string;
  isHoverCardVisible: boolean;
  /** Set of legends selected, both for multiple selection and single selection */
  selectedLegends: { [key: string]: boolean };
}
export class LegendsBase extends React.Component<ILegendsProps, ILegendState> implements ILegendContainer {
  private _hoverCardRef: HTMLDivElement;
  private _classNames: IProcessedStyleSet<ILegendsStyles>;
  /** Boolean variable to check if one or more legends are selected */
  private _isLegendSelected = false;
  private _rootElem: HTMLDivElement | null;

  public static getDerivedStateFromProps(newProps: ILegendsProps, prevState: ILegendState): ILegendState {
    const { selectedLegend, selectedLegends } = newProps;

    if (newProps.canSelectMultipleLegends && selectedLegends !== undefined) {
      return {
        ...prevState,
        selectedLegends: selectedLegends.reduce(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (combinedDict: any, key: any) => ({ [key]: true, ...combinedDict }),
          {},
        ),
      };
    }

    if (!newProps.canSelectMultipleLegends && selectedLegend !== undefined) {
      return {
        ...prevState,
        selectedLegends: { [selectedLegend]: true },
      };
    }

    return prevState;
  }

  public constructor(props: ILegendsProps) {
    super(props);
    //let defaultSelectedLegends = {};
    const initialSelectedLegends = props.selectedLegends ?? props.defaultSelectedLegends;
    const initialSelectedLegend = props.selectedLegend ?? props.defaultSelectedLegend;
    let selectedLegendsState = {};

    if (props.canSelectMultipleLegends) {
      selectedLegendsState =
        (initialSelectedLegends ?? [])?.reduce(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (combineDict: any, key: any) => ({ [key]: true, ...combineDict }),
          {},
        ) || {};
    } else if (initialSelectedLegend) {
      selectedLegendsState = { [initialSelectedLegend]: true };
    }

    this.state = {
      activeLegend: '',
      isHoverCardVisible: false,
      selectedLegends: selectedLegendsState,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  public render(): JSX.Element {
    const { theme, className, styles } = this.props;
    this._classNames = getClassNames(styles!, {
      theme: theme!,
      className,
    });
    this._isLegendSelected = Object.keys(this.state.selectedLegends).length > 0;
    const dataToRender = this._generateData();
    return (
      <div className={this._classNames.root} ref={el => (this._rootElem = el)}>
        {this.props.enabledWrapLines ? (
          this._onRenderData(dataToRender)
        ) : (
          <ResizeGroup
            data={dataToRender}
            onReduceData={this._onReduceData}
            onRenderData={this._onRenderData}
            onGrowData={this._onGrowData}
          />
        )}
      </div>
    );
  }

  public toSVG = (svgWidth: number, isRTL: boolean = false) => {
    return cloneLegendsToSVG(
      this.props.legends,
      svgWidth,
      {
        selectedLegends: this.state.selectedLegends,
        centerLegends: !!this.props.centerLegends,
        textClassName: this._classNames.text,
        isRTL,
      },
      this._rootElem,
    );
  };

  private _generateData(): ILegendOverflowData {
    const { allowFocusOnLegends = true, shape } = this.props;
    const dataItems: ILegendItem[] = this.props.legends.map((legend: ILegend, index: number) => {
      return {
        ...(allowFocusOnLegends && {
          nativeButtonProps: getNativeProps<React.HTMLAttributes<HTMLButtonElement>>(legend, buttonProperties, [
            'title',
          ]),
          'aria-setsize': this.props.legends.length,
          'aria-posinset': index + 1,
        }),
        title: legend.title,
        action: legend.action!,
        hoverAction: legend.hoverAction!,
        onMouseOutAction: legend.onMouseOutAction!,
        color: legend.color,
        shape: shape ? shape : legend.shape,
        stripePattern: legend.stripePattern,
        isLineLegendInBarChart: legend.isLineLegendInBarChart,
        opacity: legend.opacity,
        key: index,
      };
    });
    const result: ILegendOverflowData = {
      primary: dataItems,
      overflow: [],
    };
    return result;
  }

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  private _onRenderData = (data: IOverflowSetItemProps | ILegendOverflowData): JSX.Element => {
    const { overflowProps, allowFocusOnLegends = true, canSelectMultipleLegends = false } = this.props;
    const rootStyles = {
      root: {
        justifyContent: this.props.centerLegends ? 'center' : 'unset',
        flexWrap: this.props.enabledWrapLines ? 'wrap' : 'nowrap',
      },
    };
    return (
      <FocusZone
        {...(allowFocusOnLegends && {
          role: 'listbox',
          'aria-label': 'Legends',
          'aria-multiselectable': canSelectMultipleLegends,
        })}
      >
        <OverflowSet
          items={data.primary}
          overflowItems={data.overflow}
          onRenderItem={this._renderButton}
          onRenderOverflowButton={this._renderOverflowItems}
          {...overflowProps}
          styles={{ ...rootStyles, ...overflowProps?.styles }}
        />
      </FocusZone>
    );
  };

  private _onReduceData = (currentdata: IOverflowSetItemProps): {} | void => {
    if (currentdata.primary.length === 0) {
      return;
    }
    const overflow = [...currentdata.primary.slice(-1), ...currentdata.overflow];
    const primary = currentdata.primary.slice(0, -1);
    return { primary, overflow };
  };

  private _onGrowData = (currentdata: IOverflowSetItemProps): {} | void => {
    if (currentdata.overflow.length === 0) {
      return;
    }
    const overflow = currentdata.overflow.slice(1);
    const primary = [...currentdata.primary, ...currentdata.overflow.slice(0, 1)];
    return { primary, overflow };
  };

  /**
   * Get the new selected legends based on the legend that was clicked when multi-select is enabled.
   * @param legend The legend that was clicked
   * @returns An object with the new selected legend(s) state data.
   */
  private _getNewSelectedLegendsForMultiselect = (legend: ILegend): { [key: string]: boolean } => {
    let selectedLegends = { ...this.state.selectedLegends };
    if (selectedLegends[legend.title]) {
      // Delete entry for the deselected legend to make
      // the number of keys equal to the number of selected legends
      delete selectedLegends[legend.title];
    } else {
      selectedLegends[legend.title] = true;
      // Clear set if all legends are selected
      if (Object.keys(selectedLegends).length === this.props.legends.length) {
        selectedLegends = {};
      }
    }
    return selectedLegends;
  };

  /**
   * Get the new selected legends based on the legend that was clicked when single-select is enabled.
   * @param legend The legend that was clicked
   * @returns An object with the new selected legend state data.
   */

  private _getNewSelectedLegendsForSingleSelect = (legend: ILegend): { [key: string]: boolean } => {
    return this.state.selectedLegends[legend.title] ? {} : { [legend.title]: true };
  };

  private _onClick = (legend: ILegend, event: React.MouseEvent<HTMLButtonElement>): void => {
    const { canSelectMultipleLegends = false } = this.props;
    const nextSelectedLegends = canSelectMultipleLegends
      ? this._getNewSelectedLegendsForMultiselect(legend)
      : this._getNewSelectedLegendsForSingleSelect(legend);

    this.setState({ selectedLegends: nextSelectedLegends });
    this.props.onChange?.(Object.keys(nextSelectedLegends), event, legend);
    legend.action?.();
  };

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  private _onRenderCompactCard = (expandingCard: IExpandingCardProps): JSX.Element => {
    const { allowFocusOnLegends = true, className, styles, theme, canSelectMultipleLegends = false } = this.props;
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    const overflowHoverCardLegends: JSX.Element[] = [];
    const classNames = getClassNames(styles!, {
      theme: theme!,
      className,
    });
    expandingCard.renderData.forEach((legend: IOverflowSetItemProps, index: number) => {
      const hoverCardElement = this._renderButton(legend, index, true);
      overflowHoverCardLegends.push(hoverCardElement);
    });
    const hoverCardData = (
      <FocusZone
        {...(allowFocusOnLegends && {
          role: 'listbox',
          'aria-label': 'Legends',
          'aria-multiselectable': canSelectMultipleLegends,
        })}
        direction={FocusZoneDirection.vertical}
        handleTabKey={FocusZoneTabbableElements.all}
        isCircularNavigation={true}
        {...this.props.focusZonePropsInHoverCard}
        className={classNames.hoverCardRoot}
      >
        {overflowHoverCardLegends}
      </FocusZone>
    );
    return hoverCardData;
  };

  private _renderOverflowItems = (legends: ILegend[]) => {
    const { allowFocusOnLegends = true } = this.props;
    const items: IContextualMenuItem[] = [];
    legends.forEach((legend: ILegend, i: number) => {
      items.push({ key: i.toString(), name: legend.title, onClick: legend.action });
    });
    const renderOverflowData: IExpandingCardProps = { renderData: legends };
    const { theme, className, styles, overflowText } = this.props;
    const classNames = getClassNames(styles!, {
      theme: theme!,
      className,
    });
    const plainCardProps = {
      onRenderPlainCard: this._onRenderCompactCard,
      renderData: renderOverflowData,
    };

    const overflowString = overflowText ? overflowText : 'more';
    // execute similar to "_onClick" and "_onLeave" logic at HoverCard onCardHide event
    const onHoverCardHideHandler = () => {
      this.setState({ isHoverCardVisible: false });
      // Unhighlight the focused legend in the hover card
      const activeOverflowItem = find(legends, (legend: ILegend) => legend.title === this.state.activeLegend);
      if (activeOverflowItem) {
        this.setState({ activeLegend: '' });
        if (activeOverflowItem.onMouseOutAction) {
          activeOverflowItem.onMouseOutAction();
        }
      }
    };
    return (
      <HoverCard
        type={HoverCardType.plain}
        plainCardProps={plainCardProps}
        instantOpenOnClick={true}
        // eslint-disable-next-line react/jsx-no-bind
        onCardHide={onHoverCardHideHandler}
        setInitialFocus={true}
        trapFocus={true}
        onCardVisible={this._hoverCardVisible}
        styles={classNames.subComponentStyles.hoverCardStyles}
        cardDismissDelay={300}
        target={this._hoverCardRef}
      >
        {/* "button" role is not allowed as a child of parent role "listbox" */}
        <div role="option">
          <div
            className={classNames.overflowIndicationTextStyle}
            ref={(rootElem: HTMLDivElement) => (this._hoverCardRef = rootElem)}
            {...(allowFocusOnLegends && {
              role: 'button',
              'aria-expanded': this.state.isHoverCardVisible,
              'aria-label': `${items.length} ${overflowString}`,
            })}
            data-is-focusable={allowFocusOnLegends}
          >
            {items.length} {overflowString}
          </div>
        </div>
      </HoverCard>
    );
  };

  private _hoverCardVisible = () => {
    this.setState({ isHoverCardVisible: true });
  };

  private _onHoverOverLegend = (legend: ILegend) => {
    if (legend.hoverAction) {
      this.setState({ activeLegend: legend.title });
      legend.hoverAction();
    }
  };

  private _onLeave = (legend: ILegend) => {
    if (legend.onMouseOutAction) {
      this.setState({ activeLegend: '' });
      legend.onMouseOutAction();
    }
  };

  private _renderButton = (data: IOverflowSetItemProps, index?: number, overflow?: boolean) => {
    const { allowFocusOnLegends = true } = this.props;
    const legend: ILegend = {
      title: data.title,
      color: data.color,
      shape: data.shape,
      action: data.action,
      hoverAction: data.hoverAction,
      onMouseOutAction: data.onMouseOutAction,
      stripePattern: data.stripePattern,
      isLineLegendInBarChart: data.isLineLegendInBarChart,
      opacity: data.opacity,
    };
    const color = this._getColor(legend.title, legend.color);
    const { theme, className, styles } = this.props;
    const classNames = getClassNames(styles!, {
      theme: theme!,
      className,
      colorOnSelectedState: color,
      borderColor: legend.color,
      overflow,
      stripePattern: legend.stripePattern,
      isLineLegendInBarChart: legend.isLineLegendInBarChart,
      opacity: legend.opacity,
    });
    const onClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
      this._onClick(legend, event);
    };
    const onHoverHandler = () => {
      this._onHoverOverLegend(legend);
    };
    const onMouseOut = () => {
      this._onLeave(legend);
    };
    const shape = this._getShape(classNames, legend, color);
    return (
      <button
        {...(allowFocusOnLegends && {
          'aria-selected': !!this.state.selectedLegends[legend.title],
          role: 'option',
          'aria-label': `${legend.title}`,
          'aria-setsize': data['aria-setsize'],
          'aria-posinset': data['aria-posinset'],
        })}
        {...(data.nativeButtonProps && { ...data.nativeButtonProps })}
        key={index}
        className={classNames.legend}
        onClick={onClickHandler}
        onMouseOver={onHoverHandler}
        onMouseOut={onMouseOut}
        onFocus={onHoverHandler}
        onBlur={onMouseOut}
        data-is-focusable={allowFocusOnLegends}
        /* eslint-enable react/jsx-no-bind */
      >
        {shape}
        <div className={classNames.text}>{legend.title}</div>
      </button>
    );
  };

  private _getShape(
    classNames: IProcessedStyleSet<ILegendsStyles>,
    legend: ILegend,
    color: string,
  ): React.ReactNode | string {
    const svgParentProps: React.SVGAttributes<SVGElement> = {
      className: classNames.shape,
    };
    const svgChildProps: React.SVGAttributes<SVGElement> = {
      fill: color,
      strokeWidth: 2,
      stroke: legend.color,
    };
    return (
      <Shape
        svgProps={svgParentProps}
        pathProps={svgChildProps}
        shape={legend.shape as LegendShape}
        classNameForNonSvg={classNames.rect}
      />
    );
  }

  private _getColor(title: string, color: string): string {
    const { theme } = this.props;
    let legendColor = color;
    // if one or more legends are selected
    if (this._isLegendSelected) {
      // if the given legend (title) is one of the selected legends
      if (this.state.selectedLegends[title]) {
        legendColor = color;
      }
      // if the given legend is unselected
      else {
        legendColor = theme!.semanticColors.buttonBackground;
      }
    }
    // if no legend is selected
    else {
      // if the given legend is hovered
      // or none of the legends is hovered
      if (this.state.activeLegend === title || this.state.activeLegend === '') {
        legendColor = color;
      }
      // if there is a hovered legend but the given legend is not the one
      else {
        legendColor = theme!.semanticColors.buttonBackground;
      }
    }
    return legendColor;
  }
}
