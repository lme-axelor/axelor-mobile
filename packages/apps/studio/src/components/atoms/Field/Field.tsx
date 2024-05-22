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

import React, {useMemo} from 'react';
import {Text} from '@axelor/aos-mobile-ui';
import {CustomSearchBar, fetchJsonField} from '@axelor/aos-mobile-core';
import {Field as FieldType} from '../../../types';

const Field = ({
  field,
  item,
  screenConfig,
  onChangeConfig,
}: {
  field: FieldType;
  item?: any;
  screenConfig: any;
  onChangeConfig: (current: any) => void;
}) => {
  const fieldValue = useMemo(
    () => fetchJsonField(item, field.key),
    [field.key, item],
  );

  if (field.widget === 'text') {
    return <Text>{typeof fieldValue === 'string' ? fieldValue : null}</Text>;
  }

  if (field.widget === 'searchBar') {
    return (
      <CustomSearchBar
        item={{
          targetModel: field.options.modelName,
          domain: field.options.domain,
        }}
        title={field.title}
        readonly={field.readonly}
        required={field.required}
        onChange={
          (selectedValue =>
            onChangeConfig(_current => ({
              ..._current,
              [field.key]: selectedValue,
            }))) as any
        }
        defaultValue={screenConfig[field.key]}
      />
    );
  }

  return null;
};

export default Field;
