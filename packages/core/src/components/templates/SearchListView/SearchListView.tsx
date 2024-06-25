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

import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  ActionType,
  AutoCompleteSearch,
  HeaderContainer,
  ScrollList,
} from '@axelor/aos-mobile-ui';
import {ScannerAutocompleteSearch} from '../../organisms';
import {useDispatch} from '../../../redux/hooks';
import useTranslator from '../../../i18n/hooks/use-translator';
import {useIsFocused} from '../../../hooks/use-navigation';

interface SearchListViewProps {
  list: any[];
  loading: boolean;
  moreLoading: boolean;
  isListEnd: boolean;
  sliceFunction: any;
  sliceFunctionData?: Object;
  onChangeSearchValue?: (item: any) => void;
  displaySearchValue?: (item: any) => string;
  searchPlaceholder?: string;
  searchNavigate?: boolean;
  scanKeySearch?: string;
  isHideableSearch?: boolean;
  fixedItems?: any;
  topFixedItems?: any;
  chipComponent?: any;
  expandableFilter?: boolean;
  headerChildren?: any;
  headerTopChildren?: any;
  renderListItem: (item: any) => any;
  actionList?: ActionType[];
  verticalActions?: boolean;
}

const SearchListView = ({
  list,
  loading,
  moreLoading,
  isListEnd,
  sliceFunction,
  sliceFunctionData,
  onChangeSearchValue,
  displaySearchValue,
  searchPlaceholder,
  searchNavigate,
  scanKeySearch = null,
  isHideableSearch = false,
  fixedItems,
  topFixedItems,
  chipComponent,
  expandableFilter,
  headerChildren,
  headerTopChildren,
  renderListItem,
  actionList,
  verticalActions,
}: SearchListViewProps) => {
  const I18n = useTranslator();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [filter, setFilter] = useState(null);

  const fetchApi = useCallback(
    ({page, searchValue}) => {
      dispatch(
        sliceFunction({
          ...(sliceFunctionData ?? {}),
          searchValue: searchValue,
          page: page,
        }),
      );
    },
    [dispatch, sliceFunction, sliceFunctionData],
  );

  const fetchSearchAPI = useCallback(
    ({page = 0, searchValue}) => {
      setFilter(searchValue);
      fetchApi({page, searchValue});
    },
    [fetchApi],
  );

  const fetchListAPI = useCallback(
    (page = 0) => {
      fetchApi({page, searchValue: filter});
    },
    [fetchApi, filter],
  );

  useEffect(() => {
    if (isFocused) {
      fetchListAPI();
    }
  }, [fetchListAPI, isFocused]);

  const renderSearchBar = useCallback(() => {
    const SearchBar = scanKeySearch
      ? ScannerAutocompleteSearch
      : AutoCompleteSearch;

    return (
      <SearchBar
        objectList={list}
        onChangeValue={onChangeSearchValue}
        fetchData={fetchSearchAPI}
        displayValue={displaySearchValue}
        placeholder={searchPlaceholder}
        oneFilter={true}
        navigate={searchNavigate}
        scanKeySearch={scanKeySearch}
      />
    );
  }, [
    displaySearchValue,
    fetchSearchAPI,
    list,
    onChangeSearchValue,
    scanKeySearch,
    searchNavigate,
    searchPlaceholder,
  ]);

  return (
    <View style={styles.container}>
      <HeaderContainer
        topChildren={headerTopChildren}
        fixedItems={
          <>
            {topFixedItems}
            {!isHideableSearch && renderSearchBar()}
            {fixedItems}
          </>
        }
        chipComponent={chipComponent}
        expandableFilter={expandableFilter}>
        {isHideableSearch && renderSearchBar()}
        {headerChildren}
      </HeaderContainer>
      <ScrollList
        loadingList={loading}
        data={list}
        renderItem={renderListItem}
        fetchData={fetchListAPI}
        moreLoading={moreLoading}
        isListEnd={isListEnd}
        translator={I18n.t}
        actionList={actionList}
        verticalActions={verticalActions}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SearchListView;
