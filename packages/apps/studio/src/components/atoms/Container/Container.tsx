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

import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, HeaderContainer} from '@axelor/aos-mobile-ui';
import {DisplayContainer, DisplayItem} from '../../../types';
import {renderProps} from './render.helpers';

const Container = ({
  container,
  renderItem,
}: {
  container: DisplayContainer;
  renderItem: (displayItem: DisplayItem) => any;
}) => {
  if (container.widget === 'objectCard') {
    return (
      <Card style={styles.cardContainer}>
        {container.content.map(renderItem)}
      </Card>
    );
  }

  if (container.widget === 'headerContainer') {
    return (
      <HeaderContainer
        {...renderProps(
          ['topChildren', 'children', 'fixedItems', 'chipComponent'],
          container.content,
          renderItem,
        )}
        expandableFilter={container.options.expandableFilter}
      />
    );
  }

  return <View>{container.content.map(renderItem)}</View>;
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 5,
    marginVertical: 2,
  },
});

export default Container;
