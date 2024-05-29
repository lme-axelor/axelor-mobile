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

import React, {useCallback, useMemo, useState} from 'react';
import {Screen, ScrollList} from '@axelor/aos-mobile-ui';
import {useDispatch, useSelector, useTranslator} from '@axelor/aos-mobile-core';
import {
  DisplayContainer,
  DisplayItem,
  Field,
  Screen as ScreenType,
} from '../types';
import {ContainerComponent, FieldComponent} from '../components';
import {formatScreenContent} from '../helpers';
import {searchDataOfModel} from '../features/modelSlice';

const data: ScreenType = {
  model: 'com.axelor.apps.base.db.Product',
  type: 'list',
  panels: [
    {
      id: 'listView1',
      key: 'listView1',
      widget: 'listView',
      parentPanel: null,
      options: {
        modelName: 'com.axelor.apps.base.db.Product',
        domain:
          "self.isModel = false and self.productTypeSelect = 'storable' and self.dtype = 'Product'",
      },
    },
    {
      id: 'headerContainer2',
      key: 'headerContainer2',
      widget: 'headerContainer',
      parentPanel: 'listView1',
      options: {expandableFilter: false},
    },
    {
      id: 'objectCard4',
      key: 'objectCard4',
      widget: 'objectCard',
      parentPanel: 'listView1',
      options: {
        navigateOnPress: true,
        screenName: 'ProductStockDetailsScreen',
        getParams: '{product: item}',
      },
    },
  ],
  fields: [
    {
      id: 'searchBar3',
      key: 'productCategory',
      widget: 'searchBar',
      type: 'hello',
      parentPanel: 'headerContainer2-fixedItems',
      options: {modelName: 'com.axelor.apps.base.db.ProductCategory'},
    },
    {
      id: 'text5',
      key: 'code',
      widget: 'text',
      type: 'hello',
      parentPanel: 'objectCard4',
      title: 'Code',
    },
    {
      id: 'text6',
      key: 'name',
      widget: 'text',
      type: 'hello',
      parentPanel: 'objectCard4',
      title: 'Name',
    },
    {
      id: 'text7',
      key: 'fullName',
      widget: 'text',
      type: 'hello',
      parentPanel: 'objectCard4',
      title: 'FullName',
    },
    {
      id: 'text8',
      key: 'productCategory.name',
      widget: 'text',
      type: 'hello',
      parentPanel: 'objectCard4',
      title: 'Category',
    },
  ],
};

const StudioListView = ({screen = data}: {screen: ScreenType}) => {
  const I18n = useTranslator();
  const dispatch = useDispatch();

  const {loading, moreLoading, isListEnd, list} = useSelector(
    (state: any) => state.studio_model,
  );

  const [filters, setFilters] = useState<{[key: string]: any}>({});

  const screenConfig = useMemo(
    () => formatScreenContent(screen)[0] as DisplayContainer,
    [screen],
  );

  const cardItem = useMemo(
    () => screenConfig.content.find(({widget}) => widget === 'objectCard'),
    [screenConfig.content],
  );

  const headerItem = useMemo(
    () => screenConfig.content.find(({widget}) => widget === 'headerContainer'),
    [screenConfig.content],
  );

  const fetchData = useCallback(
    page => {
      dispatch(
        (searchDataOfModel as any)({
          modelName: screenConfig?.options.modelName,
          page,
          fields: screen.fields?.map(_i => _i.key),
          domain: screenConfig?.options.domain,
        }),
      );
    },
    [dispatch, screenConfig, screen.fields],
  );

  const renderComponents = useCallback(
    (displayItem: DisplayItem, item?: any) => {
      if ((displayItem as any)?.type != null) {
        return (
          <FieldComponent
            key={displayItem.key}
            field={displayItem as Field}
            item={item}
            screenConfig={filters}
            onChangeConfig={setFilters}
          />
        );
      }

      return (
        <ContainerComponent
          key={displayItem.key}
          item={item}
          container={displayItem}
          renderItem={_c => renderComponents(_c, item)}
        />
      );
    },
    [filters],
  );

  const renderItem = useCallback(
    ({item}) => {
      return renderComponents(cardItem, item);
    },
    [cardItem, renderComponents],
  );

  const filteredList = useMemo(() => {
    const _filters = Object.entries(filters).filter(
      ([_, value]) => value != null,
    );

    return list?.filter(_item => {
      return _filters.every(([fieldName, value]) =>
        typeof _item[fieldName] === 'object'
          ? _item[fieldName]?.id === value?.id
          : _item[fieldName] === value,
      );
    });
  }, [filters, list]);

  return !true ? null : (
    <Screen removeSpaceOnTop>
      {renderComponents(headerItem)}
      <ScrollList
        loadingList={loading}
        moreLoading={moreLoading}
        isListEnd={isListEnd}
        data={filteredList}
        fetchData={fetchData}
        renderItem={renderItem}
        translator={I18n.t}
      />
    </Screen>
  );
};

export default StudioListView;
