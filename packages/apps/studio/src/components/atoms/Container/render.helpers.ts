/*
 * Axelor Business Solutions
 *
 * Copyright (C) 2024 Axelor (<http://axelor.com>).
 *
 * This program is free software: you can redistribute it and/or  modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {DisplayItem} from '../../../types';

export const renderProp = (
  propsName: string,
  allContent: DisplayItem[],
  renderFunction: (displayItem: DisplayItem) => any,
) => {
  return {
    [propsName]: allContent
      .filter(({parentPanel}) => parentPanel.includes(propsName))
      .map(renderFunction),
  };
};

export const renderProps = (
  props: string[],
  allContent: DisplayItem[],
  renderFunction: (displayItem: DisplayItem) => any,
) => {
  let result = {};

  for (const propName of props) {
    result = {...result, ...renderProp(propName, allContent, renderFunction)};
  }

  return result;
};
