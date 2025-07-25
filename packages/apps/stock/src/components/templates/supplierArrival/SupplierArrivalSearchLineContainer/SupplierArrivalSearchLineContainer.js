/*
 * Axelor Business Solutions
 *
 * Copyright (C) 2025 Axelor (<http://axelor.com>).
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
import {StyleSheet} from 'react-native';
import {
  useDispatch,
  useNavigation,
  usePermitted,
  useSelector,
  useTranslator,
  useTypes,
} from '@axelor/aos-mobile-core';
import {SearchLineContainer, StockMovePickingWidget} from '../../../organisms';
import {SupplierArrivalLineActionCard} from '../../../templates';
import {fetchSupplierArrivalLines} from '../../../../features/supplierArrivalLineSlice';
import {useLineHandler, useSupplierLinesWithRacks} from '../../../../hooks';
import {LineVerification} from '../../../../types';

const scanKey = 'trackingNumber-or-product_supplier-arrival-details';
const massScanKey = 'supplier-arrival-line_mass-scan';

const SupplierArrivalSearchLineContainer = ({}) => {
  const I18n = useTranslator();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {StockMove} = useTypes();
  const {readonly} = usePermitted({
    modelName: 'com.axelor.apps.stock.db.StockMove',
  });
  const {canCreate} = usePermitted({
    modelName: 'com.axelor.apps.stock.db.StockMoveLine',
  });
  const {showLine} = useLineHandler();

  const {mobileSettings} = useSelector(state => state.appConfig);
  const {supplierArrival} = useSelector(state => state.supplierArrival);
  const {supplierArrivalLineList, totalNumberLines} =
    useSupplierLinesWithRacks(supplierArrival);

  const handleNewLine = () => {
    navigation.navigate('SupplierArrivalLineCreationScreen', {
      supplierArrival: supplierArrival,
    });
  };

  const handleViewAll = () => {
    navigation.navigate('SupplierArrivalLineListScreen', {
      supplierArrival: supplierArrival,
    });
  };

  const handleShowLine = useCallback(
    (item, skipVerification = undefined) => {
      showLine({
        move: supplierArrival,
        line: item,
        skipVerification,
        type: LineVerification.type.incoming,
      });
    },
    [showLine, supplierArrival],
  );

  const handleLineSearch = useCallback(
    item => handleShowLine(item, true),
    [handleShowLine],
  );

  const fetchSupplierLinesAPI = useCallback(
    ({page = 0, searchValue}) => {
      dispatch(
        fetchSupplierArrivalLines({
          supplierArrivalId: supplierArrival.id,
          searchValue,
          page: page,
        }),
      );
    },
    [dispatch, supplierArrival],
  );

  const handleRefresh = useCallback(
    () => fetchSupplierLinesAPI({page: 0}),
    [fetchSupplierLinesAPI],
  );

  const filterLine = useCallback(item => {
    return (
      parseFloat(item.realQty) == null ||
      parseFloat(item.realQty) < parseFloat(item.qty)
    );
  }, []);

  const showLineAdditionIcon = useMemo(() => {
    if (
      readonly ||
      !canCreate ||
      supplierArrival.statusSelect >= StockMove?.statusSelect.Realized
    ) {
      return false;
    }

    if (mobileSettings?.isSupplierArrivalLineAdditionEnabled == null) {
      return true;
    }

    return mobileSettings.isSupplierArrivalLineAdditionEnabled;
  }, [
    readonly,
    canCreate,
    supplierArrival,
    StockMove?.statusSelect.Realized,
    mobileSettings,
  ]);

  return (
    <>
      <StockMovePickingWidget
        scanKey={massScanKey}
        stockMoveId={supplierArrival.id}
        totalLines={totalNumberLines}
        onRefresh={handleRefresh}
        handleShowLine={handleLineSearch}
      />
      <SearchLineContainer
        title={I18n.t('Stock_SupplierArrivalLines')}
        numberOfItems={totalNumberLines}
        objectList={supplierArrivalLineList}
        handleSelect={handleLineSearch}
        handleSearch={fetchSupplierLinesAPI}
        scanKey={scanKey}
        onViewPress={handleViewAll}
        filterLine={filterLine}
        showAction={showLineAdditionIcon}
        onAction={handleNewLine}
        renderItem={item => (
          <SupplierArrivalLineActionCard
            style={styles.container}
            supplierArrivalLine={item}
            handleShowLine={handleShowLine}
          />
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default SupplierArrivalSearchLineContainer;
