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

import {checkNullString} from '@axelor/aos-mobile-ui';
import {DisplayContainer, DisplayItem, Field, Screen} from '../types';

export function formatScreenContent(screen: Screen): DisplayItem[] {
  if (screen == null) {
    return [];
  }

  const fields: Field[] = screen.fields;

  if (!Array.isArray(screen.panels) || screen.panels.length === 0) {
    return fields;
  }

  const panels: DisplayContainer[] = screen.panels;

  const rootPanels = panels.filter(_item => checkNullString(_item.parentPanel));

  if (rootPanels.length === 0) {
    return fields;
  }

  const result: DisplayItem[] = fields.filter(_item =>
    checkNullString(_item.parentPanel),
  );

  rootPanels.forEach(_panel => {
    result.push({
      ..._panel,
      content: getContentOfPanel(_panel.key, fields, panels),
    });
  });

  return result;
}

const getContentOfPanel = (
  key: string,
  fields: Field[],
  panels: DisplayContainer[],
): DisplayItem[] => {
  if (fields.length === 0) {
    return [];
  }

  let result: DisplayItem[] = fields.filter(_item =>
    _item.parentPanel.includes(key),
  );

  if (panels.length === 0) {
    return result;
  }

  panels
    .filter(_item => _item.parentPanel === key)
    .forEach(_item => {
      result.push({
        ..._item,
        content: getContentOfPanel(
          _item.key,
          fields.filter(_field => _field.parentPanel !== key),
          panels.filter(_panel => _panel.parentPanel !== key),
        ),
      });
    });

  return result;
};
