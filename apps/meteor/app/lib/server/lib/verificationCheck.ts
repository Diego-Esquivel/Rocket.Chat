import type { IOmnichannelGenericRoom } from '@rocket.chat/core-typings';
import { LivechatRooms } from '@rocket.chat/models';

import { callbacks } from '../../../../lib/callbacks';
import { initiateVerificationProcess } from '../functions/initiateVerificationProcess';
import { verifyVisitorCode } from '../functions/visitorsVerificationCode';
import { setVisitorEmail } from '../functions/setVisitorsEmail';

callbacks.add(
	'verificationCheck',
	async function (room: IOmnichannelGenericRoom, msg: string) {
		if (room.verficationStatus === 'isListeningToEmail') {
			const result = await setVisitorEmail(room, msg);
			if (result.success) {
				await LivechatRooms.saveRoomById({
					_id: room._id,
					verficationStatus: 'off',
					topic: '',
					tags: [],
				});
				await initiateVerificationProcess(room._id);
			}
		} else if (room.verficationStatus === 'isListeningToOTP') {
			const result = await verifyVisitorCode(room, msg);
			if (result) {
				await LivechatRooms.saveRoomById({
					_id: room._id,
					verficationStatus: 'off',
					topic: '',
					tags: [],
				});
			}
		}
	},
	callbacks.priority.HIGH,
	'verificationCheck',
);