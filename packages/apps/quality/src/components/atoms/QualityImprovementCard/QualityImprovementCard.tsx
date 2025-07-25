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

import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {ObjectCard} from '@axelor/aos-mobile-ui';
import {
  useTypeHelpers,
  useSelector,
  useTranslator,
  useTypes,
} from '@axelor/aos-mobile-core';

interface QualityImprovementCardProps {
  style?: any;
  sequence: string;
  qiDetection: string;
  status: any;
  gravityTypeSelect?: number;
  onPress?: () => void;
}

const QualityImprovementCard = ({
  style,
  sequence,
  qiDetection,
  status,
  gravityTypeSelect,
  onPress,
}: QualityImprovementCardProps) => {
  const I18n = useTranslator();
  const {getItemColorFromIndex} = useTypeHelpers();
  const {QualityImprovement} = useTypes();
  const {getItemColor, getItemTitle} = useTypeHelpers();

  const {qiStatusList} = useSelector(state => state.quality_qualityImprovement);

  const borderColor = useMemo(
    () => status && getItemColorFromIndex(qiStatusList, status)?.background,
    [getItemColorFromIndex, qiStatusList, status],
  );

  const styles = useMemo(() => getStyles(borderColor), [borderColor]);

  return (
    <ObjectCard
      onPress={onPress}
      style={[styles.card, status && styles.border, style]}
      leftContainerFlex={2}
      touchable={!!onPress}
      showArrow={false}
      upperTexts={{
        items: [
          {displayText: sequence, isTitle: true},
          {
            indicatorText: I18n.t('Quality_Detection'),
            displayText: qiDetection,
            numberOfLines: 2,
          },
        ],
      }}
      sideBadges={{
        items: [
          {
            displayText: getItemTitle(
              QualityImprovement.gravityTypeSelect,
              gravityTypeSelect,
            ),
            color: getItemColor(
              QualityImprovement.gravityTypeSelect,
              gravityTypeSelect,
            ),
          },
        ],
      }}
    />
  );
};

const getStyles = (borderColor: string) =>
  StyleSheet.create({
    border: {
      borderLeftWidth: 7,
      borderLeftColor: borderColor,
    },
    card: {
      marginHorizontal: 2,
      marginVertical: 2,
      padding: 0,
      marginRight: 5,
      paddingRight: 5,
      flex: 1,
    },
  });

export default QualityImprovementCard;
