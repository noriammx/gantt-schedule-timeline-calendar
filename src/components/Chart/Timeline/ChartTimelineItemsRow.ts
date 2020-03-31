/**
 * ChartTimelineItemsRow component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

import { Row } from '../../../types';
import { vido } from '@neuronet.io/vido/vido';
import DeepState from 'deep-state-observer';
import { Api } from '../../../api/Api';

/**
 * Bind element action
 * @param {Element} element
 * @param {any} data
 */
class BindElementAction {
  constructor(element, data) {
    let shouldUpdate = false;
    let rows = data.state.get('$data.elements.chart-timeline-items-rows');
    if (typeof rows === 'undefined') {
      rows = [];
      shouldUpdate = true;
    }
    if (!rows.includes(element)) {
      rows.push(element);
      shouldUpdate = true;
    }
    if (shouldUpdate) data.state.update('$data.elements.chart-timeline-items-rows', rows, { only: null });
  }
  public destroy(element, data) {
    data.state.update('$data.elements.chart-timeline-items-rows', rows => {
      return rows.filter(el => el !== element);
    });
  }
}

export interface Props {
  row: Row;
}

const ChartTimelineItemsRow = (vido: vido<DeepState, Api>, props: Props) => {
  const { api, state, onDestroy, Detach, Actions, update, html, onChange, reuseComponents, StyleMap } = vido;
  const actionProps = { ...props, api, state };
  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ChartTimelineItemsRow', value => (wrapper = value)));

  let ItemComponent;
  onDestroy(state.subscribe('config.components.ChartTimelineItemsRowItem', value => (ItemComponent = value)));

  let itemsPath = `$data.flatTreeMapById.${props.row.id}.$data.items`;
  let rowSub, itemsSub;
  let classNameCurrent = '';

  const itemComponents = [],
    styleMap = new StyleMap({ width: '', height: '' }, true);

  let shouldDetach = false;
  const detach = new Detach(() => shouldDetach);

  const updateDom = () => {
    const chart = state.get('$data.chart');
    shouldDetach = false;
    styleMap.style.width = chart.dimensions.width + 'px';
    if (!props) {
      shouldDetach = true;
      return;
    }
    styleMap.style.height = props.row.$data.outerHeight + 'px';
    styleMap.style['--row-height'] = props.row.$data.outerHeight + 'px';
  };

  function updateRow(row) {
    itemsPath = `$data.flatTreeMapById.${row.id}.$data.items`;
    if (typeof rowSub === 'function') {
      rowSub();
    }
    if (typeof itemsSub === 'function') {
      itemsSub();
    }
    rowSub = state.subscribe('$data.chart', value => {
      if (value === undefined) {
        shouldDetach = true;
        return update();
      }
      updateDom();
      update();
    });
    itemsSub = state.subscribe(itemsPath, value => {
      if (value === undefined) {
        shouldDetach = true;
        reuseComponents(itemComponents, [], item => ({ row, item }), ItemComponent);
        return update();
      }
      reuseComponents(itemComponents, value, item => ({ row, item }), ItemComponent);
      updateDom();
      update();
    });
  }

  const componentName = 'chart-timeline-items-row';
  let className;
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName);
      update();
    })
  );

  /**
   * On props change
   * @param {any} changedProps
   */
  onChange((changedProps: Props, options) => {
    if (options.leave || changedProps.row === undefined) {
      shouldDetach = true;
      reuseComponents(itemComponents, [], item => ({ row: undefined, item }), ItemComponent);
      return update();
    }
    props = changedProps;
    for (const prop in props) {
      actionProps[prop] = props[prop];
    }
    if (props.row.classNames && props.row.classNames.length) {
      classNameCurrent = className + ' ' + props.row.classNames.join(' ');
    } else {
      classNameCurrent = className;
    }
    updateRow(props.row);
  });

  onDestroy(() => {
    itemsSub();
    rowSub();
    itemComponents.forEach(item => item.destroy());
  });

  const componentActions = api.getActions(componentName);
  componentActions.push(BindElementAction);

  const actions = Actions.create(componentActions, actionProps);

  return templateProps => {
    return wrapper(
      html`
        <div detach=${detach} class=${classNameCurrent} data-actions=${actions} style=${styleMap}>
          ${itemComponents.map(i => i.html())}
        </div>
      `,
      { props, vido, templateProps }
    );
  };
};

export default ChartTimelineItemsRow;
