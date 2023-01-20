import type { ILivechatDepartmentRecord } from '@rocket.chat/core-typings';
import { useTranslation } from '@rocket.chat/ui-contexts';
import { useEndpoint } from '@rocket.chat/ui-contexts';
import { useCallback, useState } from 'react';

import { useScrollableRecordList } from '../../hooks/lists/useScrollableRecordList';
import { useComponentDidUpdate } from '../../hooks/useComponentDidUpdate';
import { RecordList } from '../../lib/lists/RecordList';

type DepartmentsListOptions = {
	unitId: string;
	filter: string;
};

export const useDepartmentsByUnitsList = (
	options: DepartmentsListOptions,
): {
	itemsList: RecordList<ILivechatDepartmentRecord>;
	initialItemCount: number;
	reload: () => void;
	loadMoreItems: (start: number, end: number) => void;
} => {
	const t = useTranslation();
	const [itemsList, setItemsList] = useState(() => new RecordList<ILivechatDepartmentRecord>());
	const reload = useCallback(() => setItemsList(new RecordList<ILivechatDepartmentRecord>()), []);

	const getDepartments = useEndpoint('GET', '/v1/livechat/units/:unitId/departments/available', { unitId: options.unitId || 'none' });

	useComponentDidUpdate(() => {
		options && reload();
	}, [options, reload]);

	const fetchData = useCallback(
		async (start, end) => {
			const { departments, total } = await getDepartments({
				text: options.filter,
				offset: start,
				count: end + start,
			});

			return {
				items: departments.map((department: any) => {
					if (department.archived) {
						department.name = `${department.name} [${t('Archived')}]`;
					}
					department._updatedAt = new Date(department._updatedAt);
					department.label = department.name;
					department.value = { value: department._id, label: department.name };
					return department;
				}),
				itemCount: total,
			};
		},
		[getDepartments, options.filter, t],
	);

	const { loadMoreItems, initialItemCount } = useScrollableRecordList(itemsList, fetchData, 25);

	return {
		reload,
		itemsList,
		loadMoreItems,
		initialItemCount,
	};
};
