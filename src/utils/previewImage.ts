import { ref } from "vue";
import { toast } from "vue3-toastify";

export const getPreviewImage = (imageFile: File[]): Promise<string> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return new Promise((resolve, reject) => {
    const selectedFile = ref<string>('');
    const maxFileSizeInBytes = 2 * 1024 * 1024;
    const file = imageFile[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > maxFileSizeInBytes) {
        selectedFile.value = '';
        toast.error('File size must be less than 2MB');
        return '';
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === 'string') {
          selectedFile.value = reader.result;
          resolve(selectedFile.value);
        }
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Invalid file type');
      return '';
    }
    return selectedFile.value;
  });
};
