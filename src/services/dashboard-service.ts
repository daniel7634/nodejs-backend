import {getUserCount} from '../repo';

export async function getTotalSignedUp() {
  return await getUserCount();
}

