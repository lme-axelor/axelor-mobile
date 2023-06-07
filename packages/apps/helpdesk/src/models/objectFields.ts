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

import {ObjectFields, schemaContructor} from '@axelor/aos-mobile-core';

export const helpdesk_modelAPI: ObjectFields = {
  helpdesk_ticket: schemaContructor.object({
    ticketSeq: schemaContructor.string(),
    subject: schemaContructor.string(),
    progressSelect: schemaContructor.number(),
    duration: schemaContructor.number(),
    deadlineDateT: schemaContructor.string(),
    responsibleUser: schemaContructor.subObject(),
    statusSelect: schemaContructor.number(),
    ticketType: schemaContructor.subObject(),
    prioritySelect: schemaContructor.number(),
  }),
  helpdesk_ticketType: schemaContructor.object({
    name: schemaContructor.string(),
  }),
};