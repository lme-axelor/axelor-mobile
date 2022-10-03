import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  AutoCompleteSearch,
  Chip,
  ChipSelect,
  SearchContainer,
  Screen,
  ScrollList,
  useThemeColor,
} from '@aos-mobile/ui';
import {ScannerAutocompleteSearch, useTranslator} from '@aos-mobile/core';
import filterList from '@/modules/stock/utils/filter-list';
import {searchStockLocations} from '@/modules/stock/features/stockLocationSlice';
import {
  displayInventorySeq,
  displayItemName,
} from '@/modules/stock/utils/displayers';
import {searchInventories} from '@/modules/stock/features/inventorySlice';
import {InventoryCard} from '@/modules/stock/components/organisms';
import Inventory from '@/modules/stock/types/inventory';

const stockLocationScanKey = 'stock-location_inventory-list';

const InventoryListScreen = ({navigation}) => {
  const Colors = useThemeColor();
  const I18n = useTranslator();
  const {stockLocationList} = useSelector(state => state.stockLocation);
  const [stockLocation, setStockLocation] = useState(null);
  const {loading, moreLoading, isListEnd, inventoryList} = useSelector(
    state => state.inventory,
  );
  const {user} = useSelector(state => state.user);
  const [filteredList, setFilteredList] = useState(inventoryList);
  const [plannedStatus, setPlannedStatus] = useState(false);
  const [inProgressStatus, setInProgressStatus] = useState(false);
  const [completedStatus, setCompletedStatus] = useState(false);
  const [validatedStatus, setValidatedStatus] = useState(false);
  const [filter, setFilter] = useState(null);
  const [navigate, setNavigate] = useState(false);
  const dispatch = useDispatch();

  const handlePlanifiedFilter = () => {
    if (
      !plannedStatus &&
      (completedStatus || inProgressStatus || validatedStatus)
    ) {
      setInProgressStatus(false);
      setCompletedStatus(false);
      setValidatedStatus(false);
    }
    setPlannedStatus(!plannedStatus);
  };

  const handleInProgressFilter = () => {
    if (
      !inProgressStatus &&
      (completedStatus || plannedStatus || validatedStatus)
    ) {
      setPlannedStatus(false);
      setCompletedStatus(false);
      setValidatedStatus(false);
    }
    setInProgressStatus(!inProgressStatus);
  };

  const handleCompletedFilter = () => {
    if (
      !completedStatus &&
      (inProgressStatus || plannedStatus || validatedStatus)
    ) {
      setPlannedStatus(false);
      setInProgressStatus(false);
      setValidatedStatus(false);
    }
    setCompletedStatus(!completedStatus);
  };

  const handleValidatedFilter = () => {
    if (
      !validatedStatus &&
      (inProgressStatus || plannedStatus || completedStatus)
    ) {
      setPlannedStatus(false);
      setInProgressStatus(false);
      setCompletedStatus(false);
    }
    setValidatedStatus(!validatedStatus);
  };

  const filterOnStatus = useCallback(
    list => {
      if (list == null || list === []) {
        return list;
      } else {
        if (plannedStatus) {
          return list.filter(
            item => item.statusSelect === Inventory.status.Planned,
          );
        } else if (inProgressStatus) {
          return list.filter(
            item => item.statusSelect === Inventory.status.InProgress,
          );
        } else if (completedStatus) {
          return list.filter(
            item => item.statusSelect === Inventory.status.Completed,
          );
        } else if (validatedStatus) {
          return list.filter(
            item => item.statusSelect === Inventory.status.Validated,
          );
        } else {
          return list;
        }
      }
    },
    [plannedStatus, inProgressStatus, completedStatus, validatedStatus],
  );

  useEffect(() => {
    setFilteredList(
      filterOnStatus(
        filterList(
          inventoryList,
          'stockLocation',
          'id',
          stockLocation?.id ?? '',
        ),
      ),
    );
  }, [filterOnStatus, stockLocation, stockLocationList, inventoryList]);

  const navigateToInventoryDetail = item => {
    if (item != null) {
      setNavigate(true);
      navigation.navigate(
        item.statusSelect === Inventory.status.Planned
          ? 'InventoryPlannedDetailsScreen'
          : 'InventoryStartedDetailsScreen',
        {inventoryId: item.id},
      );
    }
  };

  const fetchStockLocationsAPI = useCallback(
    filterValue => {
      dispatch(
        searchStockLocations({
          searchValue: filterValue,
          companyId: user.activeCompany?.id,
          defaultStockLocation: user.workshopStockLocation,
        }),
      );
    },
    [dispatch, user],
  );

  const fetchInventoriesAPI = useCallback(
    page => {
      dispatch(searchInventories({searchValue: filter, page: page}));
    },
    [dispatch, filter],
  );

  const handleRefChange = useCallback(
    searchValue => {
      setFilter(searchValue);
      dispatch(
        searchInventories({
          searchValue: searchValue,
          page: 0,
        }),
      );
    },
    [dispatch],
  );

  return (
    <Screen listScreen={true}>
      <SearchContainer
        fixedItems={
          <AutoCompleteSearch
            objectList={inventoryList}
            onChangeValue={item => navigateToInventoryDetail(item)}
            fetchData={handleRefChange}
            displayValue={displayInventorySeq}
            placeholder={I18n.t('Stock_Ref')}
            oneFilter={true}
            navigate={navigate}
          />
        }
        chipComponent={
          <ChipSelect scrollable={true}>
            <Chip
              selected={plannedStatus}
              title={I18n.t('Stock_Status_Planned')}
              onPress={handlePlanifiedFilter}
              selectedColor={Inventory.getStatusColor(
                Inventory.status.Planned,
                Colors,
              )}
              width={Dimensions.get('window').width * 0.35}
              marginHorizontal={3}
            />
            <Chip
              selected={inProgressStatus}
              title={I18n.t('Stock_Status_InProgress')}
              onPress={handleInProgressFilter}
              selectedColor={Inventory.getStatusColor(
                Inventory.status.InProgress,
                Colors,
              )}
              width={Dimensions.get('window').width * 0.35}
              marginHorizontal={3}
            />
            <Chip
              selected={completedStatus}
              title={I18n.t('Stock_Status_Completed')}
              onPress={handleCompletedFilter}
              selectedColor={Inventory.getStatusColor(
                Inventory.status.Completed,
                Colors,
              )}
              width={Dimensions.get('window').width * 0.35}
              marginHorizontal={3}
            />
            <Chip
              selected={validatedStatus}
              title={I18n.t('Stock_Status_Validated')}
              onPress={handleValidatedFilter}
              selectedColor={Inventory.getStatusColor(
                Inventory.status.Validated,
                Colors,
              )}
              width={Dimensions.get('window').width * 0.35}
              marginHorizontal={3}
            />
          </ChipSelect>
        }>
        <ScannerAutocompleteSearch
          objectList={stockLocationList}
          value={stockLocation}
          onChangeValue={item => setStockLocation(item)}
          fetchData={fetchStockLocationsAPI}
          displayValue={displayItemName}
          scanKeySearch={stockLocationScanKey}
          placeholder={I18n.t('Stock_StockLocation')}
        />
      </SearchContainer>
      <ScrollList
        loadingList={loading}
        data={filteredList}
        renderItem={({item}) => (
          <InventoryCard
            reference={item.inventorySeq}
            status={item.statusSelect}
            date={Inventory.getDate(item)}
            stockLocation={item.stockLocation?.name}
            origin={item.origin}
            style={styles.cardInventory}
            onPress={() => navigateToInventoryDetail(item)}
          />
        )}
        fetchData={fetchInventoriesAPI}
        moreLoading={moreLoading}
        isListEnd={isListEnd}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  cardInventory: {
    marginHorizontal: 12,
    marginVertical: 4,
  },
});

export default InventoryListScreen;
