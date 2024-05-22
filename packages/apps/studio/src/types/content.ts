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

import {ReactNode} from 'react';

export const ContentType = {
  container: 'container',
  field: 'field',
};

export type WidgetType = keyof typeof ContentType;
export type WidgetKey =
  | 'listView'
  | 'objectCard'
  | 'text'
  | 'searchBar'
  | 'headerContainer';

export interface WidgetProps {
  title?: string;
  config?: Field | Container;
}

export interface Widget {
  key: WidgetKey;
  title: string;
  type: WidgetType;
  component: (props: WidgetProps) => ReactNode;
}

export interface Tool {
  widget: Widget;
  config: Field | Container;
}

export interface Container {
  key: string;
  title?: string;
  widget: WidgetKey;
  parentPanel: string;
  options?: {[key: string]: any};
}

export type DisplayItem = DisplayContainer | Field;

export interface DisplayContainer extends Container {
  content?: DisplayItem[];
}

export interface Field {
  key: string;
  title?: string;
  type: string;
  widget: WidgetKey;
  defaultValue?: unknown;
  readonly?: boolean;
  required?: boolean;
  parentPanel: string;
  options?: {[key: string]: any};
}

export type ScreenType = 'list' | 'details' | 'form';

export const SCREEN_TYPE_VALUES: ScreenType[] = ['list', 'details', 'form'];

export interface Screen {
  model: string;
  type: ScreenType;
  panels: Container[];
  fields: Field[];
}
