import { useMemo, lazy, LazyExoticComponent, FC } from 'react';

import { addAction } from '../../channel/lib/Toolbox';
import { usePermission } from '../../contexts/AuthorizationContext';

addAction('export-messages', ({ room }) => {
	const hasPermission = usePermission('mail-messages', room._id);
	return useMemo(() => (hasPermission ? {
		groups: ['channel', 'group', 'direct'],
		id: 'export-messages',
		anonymous: true,
		title: 'Export_Messages',
		icon: 'mail',
		template: lazy(() => import('../../channel/ExportMessages')) as LazyExoticComponent<FC>,
		full: true,
		order: 12,
	} : null), [hasPermission]);
});
