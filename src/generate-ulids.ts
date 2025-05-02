import { closeMainWindow, showToast, Toast, Clipboard, showHUD } from "@raycast/api";
import { ulid } from "ulid";

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

  if (count <= 0 || count > 1000000) {
    throw new Error("Input value must be between 1 and 1,000,000");
  }

  return count;
}

export default async function Command(props: { arguments: { count: string } }) {
  try {
    const count = validateCount(props.arguments.count);

    const ulids = Array.from({ length: count }, () => ulid());

    ulids.sort();

    const result = ulids.join("\n");
    await Clipboard.copy(result);

    await showHUD(`Copied ${count} ULID(s) to clipboard`);

    await closeMainWindow();
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Error",
      message: error instanceof Error ? error.message : "Unexpected error",
    });
  }
}
