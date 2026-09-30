import { showToast, Toast, Clipboard, showHUD, LaunchProps } from "@raycast/api";
import { generateUlids, validateCount } from "./lib/ulids";

export default async function Command(props: LaunchProps<{ arguments: Arguments.GenerateUlids }>) {
  try {
    const count = validateCount(props.arguments.count);

    // Already ascending: the generator is monotonic, so no sort is needed.
    const ulids = generateUlids(count);

    await Clipboard.copy(ulids.join("\n"));

    // showHUD already hides the main window, so no extra closeMainWindow() is needed.
    await showHUD(`Copied ${count} ULID(s) to clipboard`);
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Error",
      message: error instanceof Error ? error.message : "Unexpected error",
    });
  }
}
