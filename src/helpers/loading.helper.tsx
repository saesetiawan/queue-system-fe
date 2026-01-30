import Swal from "sweetalert2";


export const openSwalLoading = () => {
    Swal.fire({
        title: "Saving...",
        text: "Please wait a moment",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
}

export const closeSwalLoading = () => {
    Swal.close();
}