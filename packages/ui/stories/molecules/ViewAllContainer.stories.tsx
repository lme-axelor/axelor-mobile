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

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {storiesOf} from '@storybook/react-native';
import {Text} from '../../src/components/atoms';
import {ViewAllContainer} from '../../src/components/molecules';

const data = [
  {id: '1', name: 'Item 1'},
  {id: '2', name: 'Item 2'},
  {id: '3', name: 'Item 3'},
  {id: '4', name: 'Item 4'},
  {id: '5', name: 'Item 5'},
];

storiesOf('ui/molecules/ViewAllContainer', module)
  .addDecorator(story => <View style={styles.decorator}>{story()}</View>)
  .add('default', () => (
    <ViewAllContainer
      children={''}
      title="View All Container"
      data={data}
      onViewPress={() => console.log('View All Pressed')}
      renderFirstTwoItems={item => <Text>{item.name}</Text>}
    />
  ));

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});