import { makeStyles, mergeClasses, shorthands } from '@griffel/react';
import { VerticalBarChartProps, VerticalBarChartStyles } from '../../index';
import { SlotClassNames } from '@fluentui/react-utilities/src/index';
import { tokens, typographyStyles } from '@fluentui/react-theme';
import { HighContrastSelector } from '../../utilities/utilities';

export const verticalbarchartClassNames: SlotClassNames<VerticalBarChartStyles> = {
  opacityChangeOnHover: 'fui-vbc__opacityChangeOnHover',
  tooltip: 'fui-vbc__tooltip',
  barLabel: 'fui-vbc__barLabel',
  lineBorder: 'fui-vbc_lineBorder',
  root: '',
  xAxis: '',
  yAxis: '',
  legendContainer: '',
  hover: '',
  descriptionMessage: '',
  axisTitle: '',
  chartTitle: '',
  shapeStyles: '',
  chartWrapper: '',
  svgTooltip: '',
  chart: '',
};
const useStyles = makeStyles({
  opacityChangeOnHover: {},
  tooltip: {
    ...typographyStyles.body1,
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding(tokens.spacingHorizontalS),
    position: 'absolute',
    textAlign: 'center',
    top: tokens.spacingVerticalNone,
    fill: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusSmall,
    pointerEvents: 'none',
  },
  barLabel: {
    ...typographyStyles.caption1Strong,
    fill: tokens.colorNeutralForeground1,
    forcedColorAdjust: 'auto',
  },
  lineBorder: {
    stroke: tokens.colorNeutralBackground1,
    [HighContrastSelector]: {
      stroke: 'Canvas',
    },
  },
});

/**
 * Apply styling to the Carousel slots based on the state
 */
export const useVerticalBarChartStyles = (props: VerticalBarChartProps): VerticalBarChartStyles => {
  const baseStyles = useStyles();

  return {
    opacityChangeOnHover: mergeClasses(
      verticalbarchartClassNames.opacityChangeOnHover,
      baseStyles.opacityChangeOnHover /*props.styles?.opacityChangeOnHover*/,
    ),
    tooltip: mergeClasses(verticalbarchartClassNames.tooltip, baseStyles.tooltip /*props.styles?.tooltip*/),
    barLabel: mergeClasses(verticalbarchartClassNames.barLabel, baseStyles.barLabel /*props.styles?.barLabel*/),
    lineBorder: mergeClasses(verticalbarchartClassNames.lineBorder, baseStyles.lineBorder /*props.styles?.lineBorder*/),
  };
};
