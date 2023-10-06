import {getUserCount} from '../repo/user-repo';

export async function getTotalSignedUp() {
  return await getUserCount();
}

