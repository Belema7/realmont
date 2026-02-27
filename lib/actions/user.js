import User from '../models/user.model';
import {connect} from '../mongodb/mongoose';

export const createOrUpdateUser = async ({
  id,
  first_name,
  last_name,
  image_url,
  email_addresses
}) => {
  try {
    const email = email_addresses?.[0]?.email_address;
    if (!email) {
      throw new Error("Missing email address in Clerk payload");
    }

    await connect();
    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          firstName: first_name,
          lastName: last_name,
          profilePicture: image_url,
          email,
        },
      },
      { new: true, upsert: true }
    );
    return user;
  } catch (error) {
    console.error("Error creating/updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
    try {
        await connect();
        await User.findOneAndDelete({ clerkId: id });
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}
