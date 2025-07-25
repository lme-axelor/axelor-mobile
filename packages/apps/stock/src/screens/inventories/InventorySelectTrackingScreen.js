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

import React, {useCallback, useState} from 'react';
import {Alert, HeaderContainer, Screen, Text} from '@axelor/aos-mobile-ui';
import {useTranslator, useTypes} from '@axelor/aos-mobile-core';
import {
  InventoryHeader,
  ProductCardInfo,
  TrackingNumberSearchBar,
} from '../../components';

const trackingScanKey = 'tracking_inventory-select';

const InventorySelectTrackingScreen = ({route, navigation}) => {
  const {inventory, inventoryLine, product} = route.params;
  const I18n = useTranslator();
  const {Inventory} = useTypes();

  const [isVisible, setVisible] = useState(false);

  const handleTrackingNumberSelection = useCallback(
    item => {
      if (item !== null) {
        if (inventoryLine != null) {
          if (item.id !== inventoryLine.trackingNumber?.id) {
            setVisible(true);
          } else {
            navigation.navigate('InventoryLineDetailsScreen', {
              inventoryLineId: inventoryLine?.id,
              inventory: inventory,
              productId: product?.id,
              trackingNumber: item,
            });
          }
        } else {
          navigation.navigate('InventoryLineDetailsScreen', {
            inventoryLineId: inventoryLine?.id,
            inventory: inventory,
            productId: product?.id,
            trackingNumber: item,
          });
        }
      }
    },
    [inventory, inventoryLine, navigation, product],
  );

  return (
    <Screen removeSpaceOnTop={true}>
      <HeaderContainer
        expandableFilter={false}
        fixedItems={
          <InventoryHeader
            reference={inventory.inventorySeq}
            status={inventory.statusSelect}
            date={
              inventory.statusSelect === Inventory?.statusSelect.Planned
                ? inventory.plannedStartDateT
                : inventory.plannedEndDateT
            }
            stockLocation={inventory.stockLocation?.name}
          />
        }
      />
      <ProductCardInfo
        onPress={() =>
          navigation.navigate('ProductStockDetailsScreen', {product})
        }
        picture={product?.picture}
        code={product?.code}
        name={product?.name}
        trackingNumber={inventoryLine?.trackingNumber?.trackingNumberSeq}
        locker={inventoryLine?.locker}
      />
      <TrackingNumberSearchBar
        scanKey={trackingScanKey}
        onChange={handleTrackingNumberSelection}
        isFocus={true}
        changeScreenAfter={true}
        product={product}
      />
      <Alert
        visible={isVisible}
        title={I18n.t('Auth_Warning')}
        confirmButtonConfig={{
          width: 50,
          title: null,
          onPress: () => setVisible(false),
        }}>
        <Text>{I18n.t('Stock_ErrorTrackingNumber')}</Text>
      </Alert>
    </Screen>
  );
};

export default InventorySelectTrackingScreen;
