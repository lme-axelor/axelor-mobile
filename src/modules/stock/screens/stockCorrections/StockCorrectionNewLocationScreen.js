import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchStockLocations} from '@/modules/stock/features/stockLocationSlice';
import {Screen} from '@/components/atoms';
import {AutocompleteSearch} from '@/components/organisms';
import getFromList from '@/modules/stock/utils/get-from-list';
import useScanner, {castIntent} from '../../utils/use-scanner';

const StockCorrectionNewLocationScreen = ({navigation, route}) => {
  const {stockLocationList} = useSelector(state => state.stockLocation);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStockLocations());
  }, [dispatch, route]);

  const handleLocationSelection = locationId => {
    if (locationId !== '') {
      const location = getFromList(stockLocationList, 'id', locationId);
      if (
        typeof route.params !== 'undefined' &&
        typeof route.params.product !== 'undefined'
      ) {
        navigation.navigate('StockCorrectionNewProductScreen', {
          stockLocation: location,
          product: route.params.product,
        });
      } else {
        navigation.navigate('StockCorrectionNewProductScreen', {
          stockLocation: location,
        });
      }
    }
  };

  const handleScan = intent => {
    console.log(intent);
    console.log(castIntent(intent));
  };

  useScanner(handleScan);

  return (
    <Screen style={styles.container}>
      <AutocompleteSearch
        objectList={stockLocationList}
        searchName="Stock Location"
        searchParam="name"
        setValueSearch={handleLocationSelection}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  searchBar: {
    marginHorizontal: 12,
    marginBottom: 8,
  },
});

export default StockCorrectionNewLocationScreen;
