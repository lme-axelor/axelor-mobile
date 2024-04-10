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

import React, {useCallback, useMemo} from 'react';
import {Screen, ScrollList} from '@axelor/aos-mobile-ui';
import {useDispatch, useSelector, useTranslator} from '@axelor/aos-mobile-core';
import {DisplayContainer, DisplayItem, Screen as ScreenType} from '../types';
import {ContainerComponent} from '../components';
import {formatScreenContent} from '../helpers';
import {searchDataOfModel} from '../features/modelSlice';

const data: ScreenType = {
  model: 'com.axelor.apps.base.db.Product',
  type: 'list',
  panels: [
    {key: 'listView1', widget: 'listView', parentPanel: null},
    {key: 'objectCard2', widget: 'objectCard', parentPanel: 'listView1'},
  ],
  fields: [
    {
      key: 'name',
      widget: 'text',
      type: 'hello',
      parentPanel: 'objectCard2',
      title: 'Name',
    },
    {
      key: 'code',
      widget: 'text',
      type: 'hello',
      parentPanel: 'objectCard2',
      title: 'Code',
    },
    {
      key: 'fullName',
      widget: 'text',
      type: 'hello',
      parentPanel: 'objectCard2',
      title: 'Details',
    },
  ],
};

const StudioListView = ({screen = data}: {screen: ScreenType}) => {
  const I18n = useTranslator();
  const dispatch = useDispatch();

  const {loading, moreLoading, isListEnd, list} = useSelector(
    (state: any) => state.studio_model,
  );

  const fetchData = useCallback(
    page => {
      dispatch((searchDataOfModel as any)({modelName: screen.model, page}));
    },
    [dispatch, screen.model],
  );

  const screenConfig = useMemo(() => formatScreenContent(screen), [screen]);

  const renderCard = useCallback((displayItem: DisplayItem, item: any) => {
    if ((displayItem as any)?.type != null) {
      console.log(item);
      return null;
    }

    return (
      <ContainerComponent
        key={displayItem.key}
        container={displayItem}
        renderItem={_c => renderCard(_c, item)}
      />
    );
  }, []);

  const renderItem = useCallback(
    (item: any) => {
      return (screenConfig[0] as DisplayContainer).content.map(_c =>
        renderCard(_c, item),
      );
    },
    [renderCard, screenConfig],
  );

  return (
    <Screen removeSpaceOnTop>
      <ScrollList
        loadingList={loading}
        moreLoading={moreLoading}
        isListEnd={isListEnd}
        data={list}
        fetchData={fetchData}
        renderItem={renderItem}
        translator={I18n.t}
      />
    </Screen>
  );
};

export default StudioListView;
