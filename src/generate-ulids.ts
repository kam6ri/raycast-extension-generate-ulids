import { showToast, Toast, Clipboard, showHUD, LaunchProps } from "@raycast/api";
import { ulid } from "ulid";

const MAX_COUNT = 1000000;

function validateCount(input?: string): number {
  if (!input) {
    return 1;
  }

  const count = Number(input);
  if (isNaN(count)) {
    throw new Error("Input value must be a number");
  }

  if (!Number.isInteger(count)) {
    throw new Error("Input value must be an integer");
  }

  if (count <= 0 || count > MAX_COUNT) {
    throw new Error(`Input value must be between 1 and ${MAX_COUNT.toLocaleString("en-US")}`);
  }

  return count;
}

export default async function Command(props: LaunchProps<{ arguments: Arguments.GenerateUlids }>) {
  try {
    const count = validateCount(props.arguments.count);

    const ulids = Array.from({ length: count }, () => ulid());

    ulids.sort();

    const result = ulids.join("\n");
    await Clipboard.copy(result);

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
