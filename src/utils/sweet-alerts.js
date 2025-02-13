import Swal from 'sweetalert2';

export function sweetAlerts(icon, message) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        customClass: {
            container: 'custom-swal-container'
        }
    });

    Toast.fire({
        icon,
        title: message,
    });
};

export const sweetAlertQuestion = () => (
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#ff5630',
        confirmButtonColor: '#52c41a',
        reverseButtons: true,
    }).then((result) => {
        if (result.isConfirmed) {
            return 'Yes';
        }
        return 'No';

    })
);