
let photoPickerIsOpen = false;

export function setPhotoPickerOpen(isOpen: boolean): void {
  photoPickerIsOpen = isOpen;
}

export function isPhotoPickerOpen(): boolean {
  return photoPickerIsOpen;
}
