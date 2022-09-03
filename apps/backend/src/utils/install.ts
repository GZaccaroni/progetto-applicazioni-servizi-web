import CustomSetting from "@/model/db/CustomSetting";
import UserDb from "@/model/db/User";

const IS_INSTALLED_KEY = "isInstalled";
export async function installIfNeeded() {
  try {
    // Check if backend needs install
    const isInstalled = await CustomSetting.findById(IS_INSTALLED_KEY);
    if (isInstalled?.value != true) {
      console.log("Installation started");
      await install();
      await CustomSetting.updateOne(
        { _id: IS_INSTALLED_KEY },
        { value: true },
        { upsert: true }
      );
      console.log("Installation completed");
    }
  } catch (e) {
    console.error("Boot failed", e);
    throw e;
  }
}

async function install() {
  // Add admin user
  await UserDb.register(
    { username: "administrator", isAdmin: true } as any,
    "administrator"
  );
}
