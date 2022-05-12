import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Screen, IconNew} from '@/components/atoms';
import {Chip} from '@/components/molecules';
import {ChipSelect, AutocompleteSearch} from '@/components/organisms';
import {fetchStockCorrections} from '@/modules/stock/features/stockCorrectionSlice';
import {fetchStockLocations} from '@/modules/stock/features/stockLocationSlice';
import {StockCorrectionCard} from '@/modules/stock/components/molecules';
import filterList from '@/modules/stock/utils/filter-list';
import {fetchProducts} from '@/modules/stock/features/productSlice';

const STATUS_DRAFT = 1;
const STATUS_VALIDATED = 2;

const getStatus = option => {
  if (option === STATUS_DRAFT) {
    return 'Draft';
  } else if (option === STATUS_VALIDATED) {
    return 'Validated';
  } else {
    return option;
  }
};

const StockCorrectionListScreen = ({navigation}) => {
  const {loadingCorrections, stockCorrectionList} = useSelector(
    state => state.stockCorrection,
  );
  const {stockLocationList} = useSelector(state => state.stockLocation);
  const {productList} = useSelector(state => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStockCorrections());
    dispatch(fetchStockLocations());
    dispatch(fetchProducts());
  }, [dispatch]);

  // Set status filter

  const [draftStatus, setDraftStatus] = useState(false);
  const [validatedStatus, setValidatedStatus] = useState(false);

  const handleDraftFilter = () => {
    if (!draftStatus && validatedStatus) {
      setValidatedStatus(!validatedStatus);
    }
    setDraftStatus(!draftStatus);
  };

  const handleValidatedFilter = () => {
    if (!validatedStatus && draftStatus) {
      setDraftStatus(!draftStatus);
    }
    setValidatedStatus(!validatedStatus);
  };

  // ----------  FILTERS -------------
  const [filteredList, setFilteredList] = useState(stockCorrectionList);
  const [queryLocation, setQueryLocation] = useState('');
  const [queryProduct, setQueryProduct] = useState('');

  const handleQueryLocationChange = locationId => {
    setQueryLocation(locationId);
  };

  const handleQueryProductChange = productId => {
    setQueryProduct(productId);
  };

  // Filter list on search params
  useEffect(() => {
    setFilteredList(
      filterOnStatus(
        filterList(
          filterList(stockCorrectionList, 'stockLocation', 'id', queryLocation),
          'product',
          'id',
          queryProduct,
        ),
      ),
    );
  }, [
    draftStatus,
    validatedStatus,
    stockCorrectionList,
    queryLocation,
    queryProduct,
  ]);

  const filterOnStatus = list => {
    if (draftStatus) {
      const draftStockCorrectionList = [];
      list.forEach(item => {
        if (item.statusSelect === 1) {
          draftStockCorrectionList.push(item);
        }
      });
      return draftStockCorrectionList;
    } else if (validatedStatus) {
      const validatedStockCorrectionList = [];
      list.forEach(item => {
        if (item.statusSelect === 2) {
          validatedStockCorrectionList.push(item);
        }
      });
      return validatedStockCorrectionList;
    } else {
      return list;
    }
  };

  // ----------  NAVIGATION -------------
  const showStockCorrectionDetails = stockCorrection => {
    navigation.navigate('StockCorrectionDetailsScreen', {
      stockCorrection: stockCorrection,
    });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconNew
          onNewPress={() => {
            navigation.navigate('StockCorrectionNewLocationScreen', {});
          }}
        />
      ),
    });
  }, [navigation]);

  return (
    <Screen style={styles.container}>
      <AutocompleteSearch
        objectList={stockLocationList}
        searchName="Stock Location"
        searchParam="name"
        setValueSearch={handleQueryLocationChange}
      />
      <AutocompleteSearch
        objectList={productList}
        searchName="Product"
        searchParam="name"
        setValueSearch={handleQueryProductChange}
      />
      <ChipSelect style={styles.chipContainer}>
        <Chip
          style={styles.chip}
          selected={draftStatus}
          title="Draft"
          onPress={handleDraftFilter}
        />
        <Chip
          style={styles.chip}
          selected={validatedStatus}
          title="Validated"
          onPress={handleValidatedFilter}
        />
      </ChipSelect>
      {loadingCorrections ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={filteredList}
          renderItem={({item}) => (
            <StockCorrectionCard
              style={styles.item}
              status={getStatus(item.statusSelect)}
              productFullname={item.product.fullName}
              stockLocation={item.stockLocation.name}
              date={
                item.statusSelect == STATUS_DRAFT
                  ? item.createdOn
                  : item.validationDateT
              }
              onPress={() => showStockCorrectionDetails(item)}
            />
          )}
        />
      )}
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
  chipContainer: {
    width: '100%',
  },
  item: {
    marginHorizontal: 12,
    marginVertical: 4,
  },
  chip: {
    width: Dimensions.get('window').width * 0.4,
    marginHorizontal: 12,
  },
});

export default StockCorrectionListScreen;
