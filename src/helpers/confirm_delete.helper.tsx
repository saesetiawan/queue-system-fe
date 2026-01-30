import Swal, { SweetAlertIcon } from "sweetalert2";

/**
 * Show a loading Swal popup
 */
export const showLoading = (title = "Loading...", text = "Please wait a moment") => {
    Swal.fire({
        title,
        text,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
};

/**
 * Show a success Swal popup
 */
export const showSuccess = (title = "Success!", text = "Operation completed successfully") => {
    Swal.fire({
        icon: "success",
        title,
        text,
        confirmButtonColor: "#10b981", // Tailwind green-500
    });
};
export const showWarning = (title = "Warning!", text = "Operation completed successfully") => {
    Swal.fire({
        icon:"warning",
        title,
        text,
        confirmButtonColor: "#10b981", // Tailwind green-500
    });
};

/**
 * Show an error Swal popup
 */
export const showError = (title = "Error!", text = "Something went wrong") => {
    Swal.fire({
        icon: "error",
        title,
        text,
        confirmButtonColor: "#ef4444", // Tailwind red-500
    });
};

/**
 * Show a confirmation Swal popup
 * Returns true if user confirmed
 */
export const showConfirm = async (
    title = "Are you sure?",
    text = "This action cannot be undone!",
    confirmText = "Yes, delete it!",
    icon: SweetAlertIcon = "warning"
): Promise<boolean> => {
    const result = await Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonColor: "#dc2626", // red-600
        cancelButtonColor: "#6b7280", // gray-500
        confirmButtonText: confirmText,
        cancelButtonText: "Cancel",
        reverseButtons: true,
    });
    return result.isConfirmed;
};

/**
 * Close any open Swal popup
 */
export const closeSwal = () => {
    Swal.close();
};
