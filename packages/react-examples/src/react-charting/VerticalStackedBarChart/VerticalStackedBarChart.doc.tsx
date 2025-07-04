import * as React from 'react';

import { IDocPageProps } from '@fluentui/react/lib/common/DocPage.types';

import { VerticalStackedBarChartBasicExample } from './VerticalStackedBarChart.Basic.Example';
import { VerticalStackedBarChartStyledExample } from './VerticalStackedBarChart.Styled.Example';
import { VerticalStackedBarChartCalloutExample } from './VerticalStackedBarChart.Callout.Example';
import { VerticalStackedBarChartTooltipExample } from './VerticalStackedBarChart.AxisTooltip.Example';
import { VerticalStackedBarChartCustomAccessibilityExample } from './VerticalStackedBarChart.CustomAccessibility.Example';
import { VerticalStackedBarChartDateAxisExample } from './VerticalStackedBarChart.DateAxis.Example';
import { VerticalStackedBarChartSecondaryYAxisExample } from './VerticalStackedBarChart.SecondaryYAxis.Example';
import { VerticalStackedBarChartNegativeExample } from './VerticalStackedBarChart.Negative.Example';
import { VSBCAxisCategoryOrderExample } from './VerticalStackedBarChart.AxisCategoryOrder.Example';

const VerticalBarChartBasicExampleCode =
  require('!raw-loader?esModule=false!@fluentui/react-examples/src/react-charting/VerticalStackedBarChart/VerticalStackedBarChart.Basic.Example.tsx') as string;
const VerticalBarChartStyledExampleCode =
  require('!raw-loader?esModule=false!@fluentui/react-examples/src/react-charting/VerticalStackedBarChart/VerticalStackedBarChart.Styled.Example.tsx') as string;
const VerticalBarChartCalloutExampleCode =
  require('!raw-loader?esModule=false!@fluentui/react-examples/src/react-charting/VerticalStackedBarChart/VerticalStackedBarChart.Callout.Example.tsx') as string;
const VerticalBarChartTooltipExampleCode =
  require('!raw-loader?esModule=false!@fluentui/react-examples/src/react-charting/VerticalStackedBarChart/VerticalStackedBarChart.AxisTooltip.Example.tsx') as string;
const VerticalBarChartCustomAccessibilityExampleCode =
  require('!raw-loader?esModule=false!@fluentui/react-examples/src/react-charting/VerticalStackedBarChart/VerticalStackedBarChart.CustomAccessibility.Example.tsx') as string;
const VerticalStackedBarChartDateAxisExampleCode =
  require('!raw-loader?esModule=false!@fluentui/react-examples/src/react-charting/VerticalStackedBarChart/VerticalStackedBarChart.DateAxis.Example.tsx') as string;
const VerticalStackedBarChartSecondaryYAxisExampleCode =
  require('!raw-loader?esModule=false!@fluentui/react-examples/src/react-charting/VerticalStackedBarChart/VerticalStackedBarChart.SecondaryYAxis.Example.tsx') as string;
const VerticalStackedBarChartNegativeExampleCode =
  require('!raw-loader?esModule=false!@fluentui/react-examples/src/react-charting/VerticalStackedBarChart/VerticalStackedBarChart.Negative.Example.tsx') as string;
const VSBCAxisCategoryOrderExampleCode =
  require('!raw-loader?esModule=false!@fluentui/react-examples/src/react-charting/VerticalStackedBarChart/VerticalStackedBarChart.AxisCategoryOrder.Example.tsx') as string;

export const VerticalStackedBarChartPageProps: IDocPageProps = {
  title: 'VerticalStackedBarChart',
  componentName: 'VerticalStackedBarChart',
  componentUrl:
    'https://github.com/microsoft/fluentui/VerticalStackedBar/master/packages/charts/react-charting/src/components/VerticalStackedBarChart',
  examples: [
    {
      title: 'VerticalStackedBarChart basic',
      code: VerticalBarChartBasicExampleCode,
      view: <VerticalStackedBarChartBasicExample />,
    },
    {
      title: 'VerticalStackedBarChart styled',
      code: VerticalBarChartStyledExampleCode,
      view: <VerticalStackedBarChartStyledExample />,
    },
    {
      title: 'VerticalStackedBarChart callout',
      code: VerticalBarChartCalloutExampleCode,
      view: <VerticalStackedBarChartCalloutExample />,
    },
    {
      title: 'VerticalStackedBarChart tooltip',
      code: VerticalBarChartTooltipExampleCode,
      view: <VerticalStackedBarChartTooltipExample />,
    },
    {
      title: 'VerticalStackedBarChart custom accessibility',
      code: VerticalBarChartCustomAccessibilityExampleCode,
      view: <VerticalStackedBarChartCustomAccessibilityExample />,
    },
    {
      title: 'VerticalStackedBarChart Date Axis',
      code: VerticalStackedBarChartDateAxisExampleCode,
      view: <VerticalStackedBarChartDateAxisExample />,
    },
    {
      title: 'VerticalStackedBarChart secondary y-axis',
      code: VerticalStackedBarChartSecondaryYAxisExampleCode,
      view: <VerticalStackedBarChartSecondaryYAxisExample />,
    },
    {
      title: 'VerticalStackedBarChart Negative',
      code: VerticalStackedBarChartNegativeExampleCode,
      view: <VerticalStackedBarChartNegativeExample />,
    },
    {
      title: 'VerticalStackedBarChart Axis Category Order',
      code: VSBCAxisCategoryOrderExampleCode,
      view: <VSBCAxisCategoryOrderExample />,
    },
  ],
  overview: require<string>('!raw-loader?esModule=false!@fluentui/react-examples/src/react-charting/VerticalStackedBarChart/docs/VerticalStackedBarChartOverview.md'),
  bestPractices: require<string>('!raw-loader?esModule=false!@fluentui/react-examples/src/react-charting/VerticalStackedBarChart/docs/VerticalStackedBarChartBestPractices.md'),
  dos: require<string>('!raw-loader?esModule=false!@fluentui/react-examples/src/react-charting/VerticalStackedBarChart/docs/VerticalStackedBarChartDos.md'),
  donts: require<string>('!raw-loader?esModule=false!@fluentui/react-examples/src/react-charting/VerticalStackedBarChart/docs/VerticalStackedBarChartDonts.md'),
  isHeaderVisible: true,
  isFeedbackVisible: true,
};
