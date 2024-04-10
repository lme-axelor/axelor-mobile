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

import {Module} from '@axelor/aos-mobile-core';
import enTranslations from './i18n/en.json';
import frTranslations from './i18n/fr.json';
import StudioScreens from './screens';
import * as studioReducers from './features';

export const StudioModule: Module = {
  name: 'app-studio',
  title: 'Studio_Studio',
  subtitle: 'Studio_Studio',
  icon: 'palette-fill',
  translations: {
    en: enTranslations,
    fr: frTranslations,
  },
  menus: {
    studio_menu_listView: {
      title: 'Studio_ListView',
      icon: 'view-list',
      screen: 'StudioListView',
    },
  },
  screens: {
    ...StudioScreens,
  },
  reducers: {
    ...studioReducers,
  },
};
export * from './api';
export * from './features/asyncFunctions-index';
