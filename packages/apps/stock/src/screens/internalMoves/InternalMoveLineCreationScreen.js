/*
 * Axelor Business Solutions
 *
 * Copyright (C) 2023 Axelor (<http://axelor.com>).
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

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {KeyboardAvoidingScrollView, Screen} from '@axelor/aos-mobile-ui';
import {useDispatch, useSelector} from '@axelor/aos-mobile-core';
import {
  InternalMoveLineCreationButton,
  InternalMoveLineNotes,
  InternalMoveLineQuantityCard,
  ProductCardInfo,
  ProductTrackingNumberSearchBar,
  StockLocationSearchBar,
} from '../../components';
import {StockMove} from '../../types';
import {fetchProductIndicators} from '../../features/productIndicatorsSlice';

const originalStockLocationScanKey =
  'original-stock-location_internal-move-select-from';

const itemScanKey = 'product-tracking-number_internal-move-select-item';

const destinationStockLocationScanKey =
  'destination-stock-location_internal-move-select-to';

const CREATION_STEP = {
  original_stockLocation: 0,
  product_trackingNumber: 1,
  destination_stockLocation: 2,
  validation: 3,
};

const InternalMoveLineCreationScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const {user} = useSelector(state => state.user);
  const {productIndicators} = useSelector(state => state.productIndicators);

  const [currentStep, setCurrentStep] = useState(
    CREATION_STEP.original_stockLocation,
  );
  const [originalStockLocation, setOriginalStockLocation] = useState(null);
  const [product, setProduct] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState(null);
  const [destinationStockLocation, setDestinationStockLocation] =
    useState(null);
  const [movedQty, setMovedQty] = useState(0);
  const [notes, setNotes] = useState('');

  const plannedQty = useMemo(
    () =>
      productIndicators.id !== product?.id
        ? 0
        : productIndicators?.availableStock,
    [product, productIndicators],
  );

  const handleFromStockLocationChange = useCallback(
    _value => {
      if (_value == null) {
        handleReset(CREATION_STEP.original_stockLocation);
      } else {
        setOriginalStockLocation(_value);
        handleNextStep(CREATION_STEP.original_stockLocation);
      }
    },
    [handleNextStep, handleReset],
  );

  const handleToProductTrackingNumberChange = useCallback(
    _value => {
      if (_value == null) {
        handleReset(CREATION_STEP.product_trackingNumber);
      } else {
        if (_value?.product != null) {
          setTrackingNumber(_value);
          setProduct(_value.product);
        } else {
          setProduct(_value);
          setTrackingNumber(null);
        }
        handleNextStep(CREATION_STEP.product_trackingNumber);
      }
    },
    [handleNextStep, handleReset],
  );

  useEffect(() => {
    if (product != null && originalStockLocation != null) {
      dispatch(
        fetchProductIndicators({
          version: product?.version,
          productId: product?.id,
          companyId: user.activeCompany?.id,
          stockLocationId: originalStockLocation?.id,
        }),
      );
    }
  }, [user.activeCompany?.id, dispatch, product, originalStockLocation]);

  const handleToStockLocationChange = useCallback(
    _value => {
      if (_value == null) {
        handleReset(CREATION_STEP.destination_stockLocation);
      } else {
        setDestinationStockLocation(_value);
        handleNextStep(CREATION_STEP.destination_stockLocation);
      }
    },
    [handleNextStep, handleReset],
  );

  const handleReset = useCallback(
    (_step = CREATION_STEP.original_stockLocation) => {
      setCurrentStep(_step);

      if (_step <= CREATION_STEP.destination_stockLocation) {
        setDestinationStockLocation(null);
      }

      if (_step <= CREATION_STEP.product_trackingNumber) {
        setProduct(null);
        setTrackingNumber(null);
        setMovedQty(0);
      }

      if (_step <= CREATION_STEP.original_stockLocation) {
        setOriginalStockLocation(null);
      }
    },
    [],
  );

  const handleNextStep = useCallback(_current => {
    setCurrentStep(() => {
      if (_current <= CREATION_STEP.original_stockLocation) {
        return CREATION_STEP.product_trackingNumber;
      }
      if (_current <= CREATION_STEP.product_trackingNumber) {
        return CREATION_STEP.destination_stockLocation;
      }
      if (_current <= CREATION_STEP.destination_stockLocation) {
        return CREATION_STEP.validation;
      }
      return _current;
    });
  }, []);

  const handleShowProduct = () => {
    navigation.navigate('ProductStockDetailsScreen', {
      product: product,
    });
  };

  return (
    <Screen
      fixedItems={
        <InternalMoveLineCreationButton
          onContinue={handleReset}
          hideIf={currentStep !== CREATION_STEP.validation}
          product={product}
          trackingNumber={trackingNumber}
          originalStockLocation={originalStockLocation}
          destinationStockLocation={destinationStockLocation}
          movedQty={movedQty}
          notes={notes}
        />
      }>
      <KeyboardAvoidingScrollView keyboardOffset={{android: 100}}>
        <StockLocationSearchBar
          placeholderKey="Stock_OriginalStockLocation"
          scanKey={originalStockLocationScanKey}
          onChange={handleFromStockLocationChange}
          defaultValue={originalStockLocation}
          isFocus={currentStep === CREATION_STEP.original_stockLocation}
        />
        {currentStep >= CREATION_STEP.product_trackingNumber ? (
          <ProductTrackingNumberSearchBar
            scanKey={itemScanKey}
            onChange={handleToProductTrackingNumberChange}
            defaultValue={trackingNumber || product}
            isFocus={currentStep === CREATION_STEP.product_trackingNumber}
          />
        ) : null}
        {currentStep >= CREATION_STEP.destination_stockLocation ? (
          <>
            <ProductCardInfo
              name={product.name}
              code={product.code}
              picture={product.picture}
              trackingNumber={
                product.trackingNumberConfiguration == null ||
                trackingNumber == null
                  ? null
                  : trackingNumber.trackingNumberSeq
              }
              onPress={handleShowProduct}
            />
            <InternalMoveLineQuantityCard
              originalStockLocation={originalStockLocation}
              stockProduct={product}
              trackingNumber={trackingNumber}
              movedQty={movedQty}
              setMovedQty={setMovedQty}
              plannedQty={plannedQty}
              status={StockMove.status.Draft}
            />
            <StockLocationSearchBar
              placeholderKey="Stock_DestinationStockLocation"
              scanKey={destinationStockLocationScanKey}
              onChange={handleToStockLocationChange}
              defaultValue={destinationStockLocation}
              isFocus={currentStep === CREATION_STEP.destination_stock}
              secondFilter={true}
            />
            <InternalMoveLineNotes
              notes={notes}
              setNotes={setNotes}
              status={StockMove.status.Draft}
            />
          </>
        ) : null}
      </KeyboardAvoidingScrollView>
    </Screen>
  );
};

export default InternalMoveLineCreationScreen;