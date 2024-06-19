import showToast from "./showToast";

export const handleCopy = async (text: string) => {
   try {
     await navigator.clipboard.writeText(text);
     showToast.success("Copied Successfully");
   } catch (err) {
     showToast.error("Couldn't copy");
   }
 };